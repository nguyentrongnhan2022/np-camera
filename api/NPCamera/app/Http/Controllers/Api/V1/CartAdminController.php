<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Delete\DeleteAdminBasicRequest;
use App\Http\Requests\Admin\Get\GetAdminBasicRequest;
use App\Http\Requests\Admin\Update\UpdateProductToCartCustomerRequest;
use App\Http\Resources\V1\CartViewResource;
use App\Http\Resources\V1\CustomerOverviewCollection;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CartAdminController extends Controller
{
    // NEED TO RECONSIDER ADDING "CREATED_AT" & "UDPATED_ATT" COLUMN TO TABLE
    // REASON FOR CHECKING USER ACTIVITIES TO MAKE A DECISION TO FREE UP SPACE IN DATABASE VIA PIVOT CART TABLE

    // Paginator function
    public function paginator($arr, $request) {
        $total = count($arr);
        $per_page = 5;
        $current_page = $request->input("page") ?? 1;

        $starting_point = ($current_page * $per_page) - $per_page;

        $arr = array_slice($arr, $starting_point, $per_page, true);

        $arr = new LengthAwarePaginator($arr, $total, $per_page, $current_page, [
            'path' => $request->url(),
            'query' => $request->query(),
        ]);

        return $arr;
    }

    /** Admin FUNCTION */
    public function all(GetAdminBasicRequest $request)
    {
        // Because we use customer ID as Cart ID so it makes sense that we reuse the other resource api view from other controller
        $check = Customer::get()->count();

        if ($check === 0) {
            return response()->json([
                "success" => false,
                "errors" => "User list is empty"
            ]);
        }

        $customers = Customer::paginate(10);

        return new CustomerOverviewCollection($customers);
    }

    /** Admin & CUSTOMER FUNCTION */
    public function index(GetAdminBasicRequest $request)
    {
        $check = DB::table("customer_product_cart")
            ->where("customer_id", "=", $request->id)->exists();

        if (!$check) {
            return response()->json([
                "success" => false,
                "errors" => "This user hasn't added any product to cart yet"
            ]);
        }

        $customer = Customer::where("id", "=", $request->id)->first();
        // $customer['products'] = $customer->customer_product_cart;
        $products_in_cart = $customer->customer_product_cart;

        $arr = [];
        // $arr['customer_id'] = $customer->id;

        for ($i = 0; $i < sizeof($products_in_cart); $i++) {
            $arr[$i]['id'] = $products_in_cart[$i]['id']; 
            $arr[$i]['name'] = $products_in_cart[$i]['name'];
            $arr[$i]['description'] = $products_in_cart[$i]['description'];
            $arr[$i]['price'] = $products_in_cart[$i]['price'];
            $arr[$i]['percentSale'] = $products_in_cart[$i]['percentSale'];
            $arr[$i]['img'] = $products_in_cart[$i]['img'];
            $arr[$i]['quantity'] = $products_in_cart[$i]['quantity'];
            $arr[$i]['status'] = $products_in_cart[$i]['status'];
            $arr[$i]['deletedAt'] = $products_in_cart[$i]['deleted_at'];
        }

        // return $customer;
        return ($this->paginator($arr, $request));

        return response()->json([
            "data" => new CartViewResource($customer)
        ]);
    }

    public function removedProduct(DeleteAdminBasicRequest $request) {
        $customer = Customer::where("id", "=", $request->id);
        $product = Product::where("id", "=", $request->productId);

        if (!$customer->exists() || !$product->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Something went wrong - Please recheck Customer ID and Product ID"
            ]);
        }

        $product_cart = DB::table("customer_product_cart")
            ->where("customer_id", "=", $customer->first()->id)
            ->where("product_id", "=", $product->first()->id);

        // Check emptiness of Customer cart
        if (!$product_cart->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Can't find product in Customer Cart, product may already got deleted"
            ]);
        }

        $delete = $product_cart->delete();

        // if (empty($delete) || empty($detach)) {
        if (empty($delete)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        return response()->json([
            "success" => true,
            "messagee" => "Removed Product with ID = " . $product->first()->id ." from Customer Cart with ID = " . $customer->first()->id . " successfully"
        ]);
    }

    public function emptyCart(DeleteAdminBasicRequest $request)
    {
        $customer = Customer::where("id", "=", $request->id);

        if (!$customer->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Can't empty Customer Cart with invalid Customer ID"
            ]);
        }

        $cart_customer = DB::table("customer_product_cart")
            ->where("customer_id", "=", $customer->first()->id);

        // Check emptiness of Customer cart
        if (!$cart_customer->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Can't empty an Empty Cart"
            ]);
        }

        $delete = $cart_customer->delete();

        // if (empty($delete) || empty($detach)) {
        if (empty($delete)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        return response()->json([
            "success" => true,
            "messagee" => "Emptied Customer Cart with ID = " . $customer->first()->id . " successfully"
        ]);
    }
    /** END OF ADMIN FUNCTION */

    public function update(UpdateProductToCartCustomerRequest $request)
    {
        $customer = Customer::find($request->id);

        $product = Product::find($request->product_id);

        if (empty($customer) || empty($product)) {
            return response()->json([
                "success" => false,
                "errors" => "Please recheck Customer ID and Product ID"
            ]);
        }
        
        // Check Request Quantity before update quantity value to cart
        if ($product->quantity < $request->quantity) {
            return response()->json([
                "success" => false,
                "errors" => "Out of Product Quantity, please reduce the amount of quantity before add product to cart"
            ]);
        }

        $query = DB::table("customer_product_cart")
            ->where("customer_id", "=", $customer->id)
            ->where("product_id", "=", $product->id);

        // If customer hasn't added this product to cart yet, then add it
        /** THIF CHECK CREATE FOR ADMIN TO USE */
        if (!$query->exists()) {
            if ($request->quantity < 0) {
                return response()->json([
                    "success" => false,
                    "errors" => "Can't add product to cart with negative quantity"
                ]);
            }

            $customer->customer_product_cart()->attach($product,[
                "quantity" => $request->quantity
            ]);

            return response()->json([
                "success" => true,
                "message" => "Product with ID = " . $request->product_id . " has successfully been added with " . $request->quantity . " quantity"
            ]);
        }

        $data = $query->first();

        // If $request->quantity value is negative
        if ($data->quantity <= ($request->quantity * -1)) { // **$request->quantity * -1** use for checking negative number
            $customer->customer_product_cart()->detach($product);

            return response()->json([
                "success" => true,
                "message" => "Successfully removed Product with ID = " . $request->id . " from cart"
            ]);
        }

        // Check current total quantity product before add
        $total = $data->quantity + $request->quantity;
        if ($total > $product->quantity) {
            return response()->json([
                "success" => false,
                "errors" => "Total Product Quantity has reached limit, please reduce product quantity"
            ]);
        }

        $customer->customer_product_cart()->updateExistingPivot($product, [
            "quantity" => $total
        ]);

        if ($request->quantity < 0) {
            return response()->json([
                "success" => true,
                "message" => "Product with ID = " . $request->product_id . " has successfully been reduced " . $request->quantity*(-1) . " quantity"
            ]);
        }

        return response()->json([
            "success" => true,
            "message" => "Updated " . $request->quantity . " quantity to existed product successfully"
        ]);
    }
}
