<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function indexPublic()
    {
        $categories = CategoryResource::collection(Category::orderBy('title', 'asc')->where('active', true)->get());

        return $categories;
    }

    public function index()
    {
        $categories = CategoryResource::collection(Category::orderBy('title', 'asc')->get());

        return $categories;
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return response()->json($category, 201);
    }

    public function update(StoreCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->update(['active' => false]);

        return response()->noContent();
    }
}
