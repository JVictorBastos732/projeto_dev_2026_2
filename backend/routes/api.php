<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
