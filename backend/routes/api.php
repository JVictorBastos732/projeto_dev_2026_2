<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'indexPublic']);
Route::post('/submissions', [SubmissionController::class, 'store']);
Route::get('/submissions/consult/{protocol}', [SubmissionController::class, 'consult']);

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{category}', [CategoryController::class, 'destroy']);

    Route::get('/admin/submissions', [SubmissionController::class, 'index']);
    Route::patch('/admin/submissions/{submission}/status', [SubmissionController::class, 'updateStatus']);
});
