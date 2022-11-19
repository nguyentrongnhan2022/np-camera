<?php

namespace App\Models;

use App\Mail\PlaceOrderMail;
use App\Notifications\PlaceOrderNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        "customer_id",
        "voucher_id",
        "id_delivery",
        "date_order",
        "address",
        "name_receiver",
        "phone_receiver",
        "total_price",
        "paid_type",
        "deleted_by",
    ];

    public function mail($customer, $order, $listProducts) {
        $title = "Quý khách đã đặt hàng thành công";
        $text = "Đơn hàng sẽ được giao đến cho quý khách sớm nhất có thể.";
        $userName = $customer->first_name . " " . $customer->last_name;
        $priceOrder = $order->total_price;
        $idDelivery = $order->id_delivery;
        Mail::to($customer->email)->send(new PlaceOrderMail($title, $text, $userName, $idDelivery, $priceOrder, $listProducts));
    }

    // Function to generate id_delivery code
    public function loopIdToCreateCertainCode($item, $limit_number)
    {
        $value = "";
        $multiply_count = 0;

        for ($i = $item; $i < $limit_number; $i = $i * 10) {
            if ($i >= $limit_number / 10) {
                for ($j = 0; $j < $multiply_count; $j++) {
                    $value = "0" . $value;
                }
                $value = $value . $item;
                break;
            }
            $multiply_count++;
        }

        return $value;
    }

    public function generateDeliveryCode($user, $order)
    {
        $current_date = date("Ymd");

        // Create UserID
        $userID = $this->loopIdToCreateCertainCode($user, 1000000);

        // Create OrderID
        $orderID = $this->loopIdToCreateCertainCode($order, 10000);

        $idDelivery = "NPON" . $userID . $orderID . "DO" . $current_date;

        return $idDelivery;
    }

    public function placeOrder($request, $data, $customer) {
        // Set to Vietnam timezone
        // date_default_timezone_set('Asia/Ho_Chi_Minh');

        // Check voucher existence
        // $query = Voucher::where("id", "=", $request->voucher_id);
        $query = Voucher::where("name", "=", $request->voucher_code);

        // If voucher is existed, then continue checking voucher attributes
        if ($query->exists()) {

            $vouchers = $query->first();

            // Check expired date and "Deleted" Attributes
            $current_date = date("Y-m-d H:i:s");

            if ((strtotime($vouchers->expired_date) - strtotime($current_date)) < 0 || $vouchers->deleted !== null) {
                return response()->json( [
                    "success" => false,
                    "errors" => "Voucher code is expired, please recheck your voucher code"
                ]);
            }

            // Check usage
            if ($vouchers->usage === 0) {
                return response()->json( [
                    "success" => false,
                    "errors" => "Voucher code is out of usage, better luck next time"
                ]);
            }

            // Check Customer has already used vouher (?)
            $voucher_exist_in_customer = Order::where("voucher_id", "=", $vouchers->id)
                ->where("customer_id", "=", $customer->id)->exists();

            if ($voucher_exist_in_customer) {
                return response()->json( [
                    "success" => false,
                    "errors" => "You have already used this voucher."
                ]);
            }
        } else if (!empty($request->voucher_code)) {
            return response()->json( [
                "success" => false,
                "errors" => "Voucher code doesn't exist, please recheck your voucher code"
            ]);
        }

        // Check product is available or already got deleted
        $count = 0;
        $invalid_product_quantity_arr = [];
        $index = 0; // use for invalid_quatity_arr array
        for ($i = 0; $i < sizeof($data); $i++) {
            $value = Product::where("id", "=", $data[$i]->product_id)->first();

            // Comparing Quantity product from Cart is "smaller than" Total remaining Product currently has
            if ($data[$i]->quantity > $value->quantity) {
                $invalid_product_quantity_arr[$index] = $value->name;
                $index++;
            }

            if ($value->status === 0 || $value->deleted_at !== null) {
                $count++;
            }
        }

        // Check if Current Customer Cart has any invalid Product Quantity
        if (!empty($invalid_product_quantity_arr)) {
            return response()->json( [
                "success" => false,
                "errors" => "Some products don't have enough quantity in Cart. These are: " . implode(", ", $invalid_product_quantity_arr)
            ]);
        }

        // if count !== 0, that mean 1 or 2 product is got deleted or already out of stock
        if ($count !== 0) {
            return response()->json( [
                "success" => false,
                "errors" => "1 or 2 product got deleted or have already out of stock, please recheck your cart"
            ]);
        }
        /** ##### END OF IF CONDITION SECTION ##### */

        $arr = [];
        $total_price = 0;
        $voucher_data = $query->first();
        $voucher_sale_value = $voucher_data->percent ?? 0;

        for ($i = 0; $i < sizeof($data); $i++) {
            $value = Product::where("id", "=", $data[$i]->product_id)->first();

            $arr[$i]['product_id'] = $value->id;
            $arr[$i]['quantity'] = $data[$i]->quantity;
            $arr[$i]['price'] = $value->price;
            $arr[$i]['percent_sale'] = $value->percent_sale;
            $sale_price = $value->price * $value->percent_sale / 100;

            $total_price = $total_price + (($value->price - $sale_price) * $data[$i]->quantity);
        }

        $order = Order::where("customer_id", "=", $customer->id)->get()->count();
        $id_delivery = $this->generateDeliveryCode($customer->id, $order + 1); // "$order + 1" for new order

        $filtered = $request->except("voucherCode", "dateOrder", "nameReceiver", "phoneReceiver", "paidType");
        $filtered['voucher_id'] = $voucher_data->id ?? null;
        $filtered["customer_id"] = $customer->id;
        $filtered["total_price"] = $total_price - (($total_price * $voucher_sale_value) / 100);
        $filtered['id_delivery'] = $id_delivery;

        // Change usage value of voucher, But first need to check VoucherCode field
        if (!empty($request->voucher_code)) {
            if ($voucher_data->usage === 1) { // If voucher usage is = 1, then change its value to 0 and change deleted value
                $voucher_data->usage = 0;
                $voucher_data->deleted = 1;
                $voucher_data->save();
            } else { // If voucher usage is not = 0, then descrease like normal
                $voucher_data->usage = $voucher_data->usage - 1;
                $voucher_data->save();
            }
        }

        // Add order to database
        $check = Order::create($filtered);

        // Check if data insert to database isSuccess
        if (empty($check->id)) {
            return response()->json( [
                "success" => false,
                "errors" => "Something went wrong"
            ]);
        }

        $order = Order::find($check->id);

        /** ==> Use Generate Delivery Code HERE */

        // Insert data into intermediate table (order_product)
        for ($i = 0; $i < sizeof($arr); $i++) {
            $productId = Product::find($arr[$i]["product_id"]);
            $confirm = $order->products()->attach($productId, [
                "quantity" => $arr[$i]["quantity"],
                "price" => $arr[$i]["price"],
                "percent_sale" => $arr[$i]['percent_sale']
            ]);
        }

        // Detach data from intermediate table (customer_product_cart)
        $detach = $customer->customer_product_cart()->detach();

        // Get list product from current order
        $productsInOrder = [];
        $productsFromOrder = DB::table("order_product")
            ->where("order_id", "=", $order->id)
            ->get();

        for ($i = 0; $i < sizeof($productsFromOrder); $i++) {
            $product = Product::where("id", "=", $productsFromOrder[$i]->product_id)->first();
            $productsInOrder[$i]['id'] = $product->id;
            $productsInOrder[$i]['name'] = $product->name;
            $productsInOrder[$i]['price'] = $product->price;
            $productsInOrder[$i]['quantity'] = $productsFromOrder[$i]->quantity;
        }

        // Send mail to notify customer has placed order successfully
        $this->mail($customer, $order, $productsInOrder);

        if (empty($detach)) {
            return response()->json( [
                "success" => false,
                "errors" => "Something went wrong"
            ]);
        }

        return response()->json( [
            "success" => true,
            "message" => "Placed order successfully"
        ]);
    }

    public function customers()
    {
        return $this->belongsTo(Customer::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, "order_product", "order_id", "product_id")->withPivot("quantity", "price", "percent_sale");
    }

    public function vouchers()
    {
        return $this->belongsTo(Voucher::class);
    }
}
