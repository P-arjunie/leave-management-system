<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\LeaveController;
use App\Http\Controllers\API\AdminController;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Middleware\CheckRole;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Leave routes (accessible by both admin and employee)
    Route::get('/leaves', [LeaveController::class, 'index']);
    Route::post('/leaves', [LeaveController::class, 'store']);
    Route::get('/leaves/{id}', [LeaveController::class, 'show']);

    // Admin only routes
    Route::middleware(['auth:api', CheckRole::class.':admin'])->group(function () {
        Route::put('/leaves/{id}', [LeaveController::class, 'update']);
        Route::get('/admin/employees', [AdminController::class, 'getEmployees']);
        Route::get('/users/{userId}/leaves', [LeaveController::class, 'getUserLeaves']);
    });
});

Route::get('/users/{userId}/leaves', [LeaveController::class, 'getUserLeaves']);

