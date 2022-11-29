<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Delete\DeleteAdminBasicRequest;
use App\Http\Requests\Admin\Get\GetAdminBasicRequest;
use App\Http\Requests\Admin\Update\UpdateOrderCustomerRequest;
use App\Http\Resources\V1\OrderListCollection;
use App\Http\Resources\V1\ProductDetailResource;
use App\Mail\OrderDeliveredNotify;
use App\Mail\OrderDeliveredState;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OrderCustomerController extends Controller
{
    public function index(GetAdminBasicRequest $request, Customer $customer)
    {
        $order = $customer->orders;

        if (empty($order)) {
            return response()->json([
                "success" => false,
                "errors" => "This user currently hasn't placed any order"
            ]);
        }

        return response()->json([
            "success" => true,
            "data" => new OrderListCollection($order)
        ]);
    }

    public function show(GetAdminBasicRequest $request, Customer $customer, Order $order)
    {
        // Check existence of Customer and Order via Customer ID and Order ID
        $query = Order::where("orders.id", "=", $order->id)
            ->where("customer_id", "=", $customer->id);

        if (!$query->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Something went wrong - Please recheck your Customer ID and Order ID"
            ]);
        }

        $data = $query->first();

        if ($data->voucher_id !== null) {
            $voucher = Voucher::where("id", "=", $data->voucher_id)->first();
            
            $voucher_data = [
                "voucherId" => $voucher->voucher_id,
                "percent" => $voucher->percent,
                "name" => $voucher->name,
                "expiredDate" => $voucher->expired_date,
                "deleted" => $voucher->deleted,
            ];
        }
        else {
            $voucher_data = null;
        }

        // Create product array
        $pivot_table = Order::find($order->id);

        $data["products"] = $pivot_table->products;

        return response()->json([
            "success" => true,
            "data" => [
                "customer" => [
                    "customerId" => $customer->id,
                    "firstName" => $customer->first_name,
                    "lastName" => $customer->last_name,
                    "email" => $customer->email,
                    "avatar" => $customer->avatar,
                    "defaultAvatar" => $customer->default_avatar,
                ],
                "voucher" => $voucher_data,
                "order" => [
                    "id" => $data->id,
                    "idDelivery" => $data->id_delivery,
                    "dateOrder" => $data->date_order,
                    "address" => $data->address,
                    "nameReceiver" => $data->name_receiver,
                    "phoneReceiver" => $data->phone_receiver,
                    "totalPrice" => $data->total_price,
                    "status" => $data->status,
                    "paidType" => $data->paid_type,
                    "deleted_by" => $data->deleted_by,
                    "createdAt" => date_format($data->created_at, "d/m/Y H:i:s"),
                    "updatedAt" => date_format($data->updated_at, "d/m/Y H:i:s"),
                ],
                "products" => ProductDetailResource::collection($data->products)
            ]
        ]);
    }

    public function update(UpdateOrderCustomerRequest $request, Customer $customer, Order $order)
    {
        $query = Order::where("id", "=", $order->id)
            ->where("customer_id", "=", $customer->id);

        if (!$query->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Customer don't have this Order with ID = " . $order->id
            ]);
        }

        $order_data = $query->first();

        // Checking Order_status or Deleted_by column isNull
        // 0 fresh new and null is order doesn't get cancelled
        if ($order_data->status === 0 && $order_data->deleted_by === null) {
            // Create products array
            $products = $request->products;

            // Get voucher & create total_price variable
            if ($request->voucher_id !== null) {
                $voucher = Voucher::find($request->voucher_id);
                $voucher_value = $voucher->percent;
            } else {
                $voucher_value = 0;
            }

            $total_price = 0;

            // Delete all previous products in pivot "order_product" table
            $order_data->products()->detach();

            // ReAdd all new products to pivot "order_product" table
            for ($i = 0; $i < sizeof($products); $i++) {

                // Check product ID
                $product = Product::find($products[$i]['id']);
                $order_data->products()->attach($product, [
                    "quantity" => $products[$i]["quantity"],
                    "price" => $product->price,
                    "percent_sale" => $product->percent_sale
                ]);

                // Create variable to store sale price of product
                $sale_price = ($product->price * $product->percent_sale) / 100;
                $total_price = $total_price + (($product->price - $sale_price) * $products[$i]["quantity"]);
            }

            // Calculate total price with voucher
            $filtered = $request->except("voucherId", "dateOrder", "nameReceiver", "phoneReceiver", "paidType");
            $filtered["customer_id"] = $customer->id;
            $filtered["total_price"] = $total_price - (($total_price * $voucher_value) / 100);

            $check = $order_data->update($filtered);

            // Check if data insert to database isSuccess
            if (empty($check)) {
                return response()->json([
                    "success" => false,
                    "errors" => "Something went wrong"
                ]);
            }

            return response()->json([
                "success" => true,
                "message" => "Updated Order ID = " . $order->id . " successfully"
            ]);
        }

        return response()->json([
            "success" => false,
            "errors" => "Please recheck Order status and Order deleted_by"
        ]);
    }

    public function updateStatus(Request $request, Customer $customer, Order $order)
    {
        /** Update current status of order 
         * Status can change from "Pending" to "Confirmed" and vice versa if admin dectects any supscious actions
         * Status can only be changed from "Confirmed" to "Completed", no reverse allow
         * When status is in "Completed" status, quantity was store in pivot table "order_prodcut" with use to minus the quantity of products in "products" table
         */

        // Check order (Soft) Delete state and Order status
        if ($order->deleted_by !==  null || $order->status === 2) {
            return response()->json([
                "success" => false,
                "errors" => "Can't Update Status when Order got cancelled or Order is in Completed state"
            ]);
        }

        $query = Order::where("id", "=", $order->id)
            ->where("customer_id", "=", $customer->id);

        // Check Connection between Customer and Order
        if (!$query->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Customer don't have this Order with ID = " . $order->id
            ]);
        }

        $order_data = $query->first();

        $state = (int) $request->state;
        $order_data->status = $state;
        $result = $order_data->save();

        if (empty($result)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        if ($state === 0) {
            $order_state = "Pending";
        } else if ($state === 1) {
            $order_state = "Confirmed";
        } else {
            $order_state = "Completed";
        }

        return response()->json([
            "success" => true,
            "message" => "Successfully Updated Order with ID = " . $order->id .  " to " . $order_state . " state"
        ]);
    }

    // Use for order has already been delivered to customer
    public function mail($customer, $order, $listProducts)
    {
    }

    public function notifyOrder(GetAdminBasicRequest $request, Customer $customer, Order $order)
    {
        // Check order (Soft) Delete state and Order status
        if ($order->deleted_by !==  null || $order->status === 2) {
            return response()->json([
                "success" => false,
                "errors" => "Can't Update Status when Order got cancelled or Order is in Completed state"
            ]);
        }

        $query = Order::where("id", "=", $order->id)
            ->where("customer_id", "=", $customer->id);

        // Check Connection between Customer and Order
        if (!$query->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Customer don't have this Order with ID = " . $order->id
            ]);
        }

        $order_data = $query->first();

        // Send
        $userName = $customer->first_name . " " . $customer->last_name;
        $priceOrder = $order->total_price;
        $idDelivery = $order->id_delivery;
        
        // If state is 1, then Send Notify to customer that Order has been delivered
        if ((int) $request->state === 1) {
            $title = "Đơn hàng đã được giao thành công";
            Mail::to($customer->email)->queue(new OrderDeliveredState($title, $userName, $idDelivery, $priceOrder));
        }
        // If state is 0, then send Notify to Customer to Click "Completed" button to completed order state.
        else {
            $title = "Vui lòng xác nhận đơn hàng đã được giao";
            Mail::to($customer->email)->queue(new OrderDeliveredNotify($title, $userName, $idDelivery, $priceOrder));
        }

        return response()->json([
            "success" => true,
            "message" => "Successfully Send Notification to Customer"
        ]);
    }

    public function destroy(Customer $customer, Order $order, DeleteAdminBasicRequest $request)
    {
        // Checking The connection between Order and Customer
        $order_data = Order::where("id", "=", $order->id)
            ->where("customer_id", "=", $customer->id)
            ->exists();

        if (!$order_data) {
            return response()->json([
                "success" => false,
                "errors" => "Please recheck Order ID and Customer ID"
            ]);
        }

        // If Order state is 2 (Completed state), then return
        if ($order->status === 2) {
            return response()->json([
                "success" => false,
                "errors" => "Can't cancelled Order in Completed State"
            ]);
        }

        // Check state to switch between (Soft) Delete and Reverse Delete
        // If value state is 1, it will be (Soft) Delete
        // State right here is delete state not Order state
        if ((int)$request->state !== 0) {
            // Checking whether Deleted_by column is null or not
            if ($order->deleted_by !== null || $order->deleted_by === 0) {
                return response()->json([
                    "success" => false,
                    "errors" => "Order with ID = " . $order->id . " has already been cancelled"
                ]);
            }

            // If not then asign value to order->deleted_by by 1 (1 for admin; 0 for customer)
            $order->deleted_by = 1;
            $result = $order->save();

            if (!$result) {
                return response()->json([
                    "success" => false,
                    "errors" => "An unexpected error has occurred"
                ]);
            }

            return response()->json(
                [
                    'success' => true,
                    'message' => "Sucessfully cancelled Order ID = " . $order->id . " for Customer ID = " . $customer->id
                ]
            );

            // If value state is not 1, it will be Reverse Delete
        } else {
            // Checking The connection between Order and Customer
            if (!$order_data) {
                return response()->json([
                    "success" => false,
                    "errors" => "Please recheck Order ID and Customer ID"
                ]);
            }

            // Checking whether Deleted_by column is null or not
            if ($order->deleted_by === null) {
                return response()->json([
                    "success" => false,
                    "errors" => "Order with ID = " . $order->id . " has already been reversed cancel"
                ]);
            }

            // If not then asign value to order->deleted_by by 1 (1 for admin; 0 for customer)
            $order->deleted_by = null;
            $result = $order->save();

            if (!$result) {
                return response()->json([
                    "success" => false,
                    "errors" => "An unexpected error has occurred"
                ]);
            }

            return response()->json(
                [
                    'success' => true,
                    'message' => "Sucessfully reversed cancel Order ID = " . $order->id . " for Customer ID = " . $customer->id
                ]
            );
        }
    }
}
