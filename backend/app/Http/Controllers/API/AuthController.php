<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Laravel\Passport\TokenRepository;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            Log::info('Registration attempt', [
                'email' => $request->email,
                'role' => $request->role
        ]);

            $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
                'role' => $request->role ?? 'employee', // Use provided role or default to employee
            ];

            $user = User::create($userData);
            Log::info('User created successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
        ]);

        $token = $user->createToken('auth_token')->accessToken;

        return response()->json([
            'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
        ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            Log::info('Login attempt', [
                'email' => $request->email
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
                Log::warning('Login failed - Invalid credentials', [
                    'email' => $request->email
                ]);
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

            $user = User::where('email', $request->email)->firstOrFail();
            
            // Revoke any existing tokens
            $user->tokens()->delete();
            
            // Create new token
        $token = $user->createToken('auth_token')->accessToken;
            
            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
            ]);

        return response()->json([
            'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        } catch (ValidationException $e) {
            Log::warning('Login failed - Validation error', [
                'errors' => $e->errors()
            ]);
            return response()->json([
                'message' => 'Invalid credentials',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
        return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            Log::error('Logout failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
        return response()->json($request->user());
        } catch (\Exception $e) {
            Log::error('Failed to fetch user data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to fetch user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
