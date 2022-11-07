<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CategoryDetailCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::paginate(10);

        return new CategoryDetailCollection($categories);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreCategoryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCategoryRequest $request)
    {
        $check = Category::where("name", "=", $request->name)->exists();

        if ($check) {
            return response()->json([
                "success" => false,
                "errors" => "Category has already existed, please change category name"
            ]);
        }

        $result = Category::create($request->all());

        if (!$result) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected errors has occurred"
            ]);
        }

        return response()->json([
            "success" => true,
            "message" => "Created new Category successfully"
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $query = Category::where("id", "=", $request->id);

        if (!$query->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Category ID is invalid"
            ]);
        }

        $data = $query->first();

        return [
            "categoryId" => $data->id,
            "name" => $data->name,
            "createdAt" => $data->created_at,
            "updatedAt" => $data->updated_at,
        ];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateCategoryRequest  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCategoryRequest $request)
    {
        $query = Category::where("id", "=", $request->id);

        if (!$query->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Can't update with invalid Category ID"
            ]);
        }

        // Check exists category
        $check = Category::where("name", "=", $request->name)->exists();

        if ($check) {
            return response()->json([
                "success" => false,
                "errors" => "Category has already existed, please change category name"
            ]);
        }

        $update = $query->update($request->all());

        if (empty($update)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        return response()->json([
            "success" => true,
            "message" => "Updated Category with ID = " . $request->id . " successfully"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $category = Category::where("id", "=", $request->id);

        if (!$category->exists()) {
            return response()->json([
                "success" => false,
                "errors" => "Can't delete Category with Invalid Category ID"
            ]);
        }

        // Remove categories attached to product first
        $category_product = DB::table("category_product")
            ->where("category_id", "=", $request->id);

        if ($category_product->exists()) {            
            $category_product->delete(); // Need to check delete state
        }

        $delete = $category->delete();

        // if (empty($delete) || empty($detach)) {
        if (empty($delete)) {
            return response()->json([
                "success" => false,
                "errors" => "An unexpected error has occurred"
            ]);
        }

        return response()->json([
            "success" => false,
            "messagee" => "Deleted category successfully"
        ]);
    }
}
