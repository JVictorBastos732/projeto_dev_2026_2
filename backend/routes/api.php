<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'indexPublic']);
Route::post('/submissions', [SubmissionController::class, 'store']);
Route::get('/submissions/consult/{protocol}', [SubmissionController::class, 'consult']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy']);

    Route::get('/admin/submissions', [SubmissionController::class, 'index']);
    Route::patch('/admin/submissions/{submission}/status', [SubmissionController::class, 'updateStatus']);
});
