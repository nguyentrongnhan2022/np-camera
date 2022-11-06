<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Http\Resources\V1\AddressListCollection;
use App\Http\Resources\V1\AddressOverviewCollection;
use App\Http\Resources\V1\AddressOverviewResource;
use App\Models\Address;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressCustomerController extends Controller
{
    public function all()
    {
        $addresses = Address::with("customers");

        $count = $addresses->get()->count();

        if (empty($count)) {
            return response()->json([
                "success" => false,
                "errors" => "Address list is empty"
            ]);
        }

        return new AddressListCollection($addresses->paginate());
    }

    public function index(Customer $customer)
    {
        $customer_data = Customer::find($customer->id);

        if (empty($customer_data)) {
            return response()->json([
                "success" => false,
                "errors" => "User ID is invalid"
            ]);
        }

        $addresses = $customer_data->addresses;

        if (empty($addresses)) {
            return response()->json([
                "success" => false,
                "errors" => "This user has created any address yet"
            ]);
        }

        return new AddressOverviewCollection($addresses);
    }

    public function show(Customer $customer, Address $address)
    {
        // $request->id is for customer
        // $customer_data = Customer::where("id", "=", $customer->id);
        $addresses = Address::where("id", "=", $address->id)
            ->where("customer_id", "=", $customer->id);

        // if (!$customer_data->exists() || !$addresses->exists()) {
        if (!$addresses->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Something went wrong - Please recheck Customer ID and Address ID"
            ]);
        }

        if ($addresses->get()->count() === 0) {
            return response()->json([
                "success" => false,
                "errors" => "Address ID is invalid"
            ]);
        }

        return response()->json([
            "success" => true,
            "data" => new AddressOverviewResource($addresses->first())
        ]);
    }

    public function store(StoreAddressRequest $request, Customer $customer)
    {
        $check = Address::where("customer_id", "=", $customer->id)
            ->where("first_name_receiver", "=", $request->firstNameReceiver)
            ->where("last_name_receiver", "=", $request->lastNameReceiver)
            ->where("street_name", $request->streetName)
            ->where("district", $request->district)
            ->where("ward", $request->ward)
            ->where("city", $request->city)->exists();

        if ($check) {
            return response()->json([
                "success" => false,
                "errors" => "Address is already existed"
            ]);
        }

        $filtered = $request->except(['firstNameReceiver', 'lastNameReceiver', "phoneReceiver", "streetName"]);
        $filtered['customer_id'] = $customer->id;

        $address = Address::create($filtered);

        if (empty($address)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        // $address->customers()->attach($user);

        return response()->json([
            "success" => true,
            "message" => "Create new address for Customer ID = " . $customer->id . " successfully"
        ]);
    }

    public function update(UpdateAddressRequest $request, Customer $customer, Address $address)
    {
        // Checking Address ID is belong to Customer ID ?
        // $check = DB::table("address_customer")
        //     ->where("customer_id", "=", $customer->id)
        //     ->where("address_id", "=", $address->id)
        //     ->exists();

        $query = Address::where("id", "=", $address->id)
            ->where("customer_id", "=", $customer->id);

        if (!$query->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Something went wrong - Please recheck Customer ID and Address ID"
            ]);
        }

        // Check address existence in database
        $check = Address::where("customer_id", "=", $customer->id)
            ->where("first_name_receiver", "=", $request->firstNameReceiver)
            ->where("last_name_receiver", "=", $request->lastNameReceiver)
            ->where("street_name", $request->streetName)
            ->where("district", $request->district)
            ->where("ward", $request->ward)
            ->where("city", $request->city)
            ->exists();

        // If address is existed, then check does it belong to current customer is updating their address
        if ($check) {
            return response()->json([
                "success" => false,
                "errors" => "Address is already associated with this account"
            ]);
        }

        $filtered = $request->except(['firstNameReceiver', 'lastNameReceiver', "phoneReceiver", "streetName"]);
        $filtered['customer_id'] = $customer->id;

        $update = $query->update($filtered);

        if (empty($update)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        return response()->json([
            "success" => true,
            "message" => "Update Address with ID = " . $address->id . " successfully"
        ]);
    }

    public function destroy(Customer $customer, Address $address)
    {
        // Checking Address ID is belong to Customer ID ?
        // $check = DB::table("address_customer")
        //     ->where("customer_id", "=", $customer->id)
        //     ->where("address_id", "=", $address->id)
        //     ->exists();

        $query_address = Address::where("id", "=", $address->id)
            ->where("customer_id", "=", $customer->id);

        if (!$query_address->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Something went wrong - Please recheck Customer ID and Address ID"
            ]);
        }

        // Detach address from customer
        // $detach = Customer::where("id", "=", $customer->id)
        //     ->first()
        //     ->addresses()
        //     ->detach($query_address->first());

        // Delete address with Address ID in Addresses table
        $delete = $query_address->delete();


        // if (empty($delete) || empty($detach)) {
        if (empty($delete)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        return response()->json([
            "success" => true,
            "message" => "Remove addess with Address ID = " . $address->id . " from Customer ID = " . $customer->id . " successfully"
        ]);
    }
}