<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoginResource;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\LogoutResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
         $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciais inválidas.',
            ], 422);
        }

        $user = auth()->user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return new LoginResource($user, $token);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return new LogoutResource($user);
    }

    public function me(Request $request)
    {
        $user = auth()->user();
        return new UserResource($user);
    }
}
