<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; 
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function getEmployees()
    {
        try {
            $user = Auth::user();
            Log::info('Fetching employees list', [
                'user_id' => $user->id,
                'user_role' => $user->role
            ]);

        if (!$user->isAdmin()) {
                Log::warning('Unauthorized access attempt to getEmployees', [
                    'user_id' => $user->id,
                    'user_role' => $user->role
                ]);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

            $employees = User::where('role', 'employee')
                ->withCount([
                    'leaves as pending_leaves_count' => function ($query) {
                        $query->where('status', 'pending');
                    },
                    'leaves as approved_leaves_count' => function ($query) {
                        $query->where('status', 'approved');
                    },
                    'leaves as rejected_leaves_count' => function ($query) {
                        $query->where('status', 'rejected');
                    }
                ])
                ->get();

            Log::info('Employees fetched successfully', [
                'count' => $employees->count(),
                'user_id' => $user->id
            ]);

            return response()->json([
                'message' => 'Employees fetched successfully',
                'employees' => $employees
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching employees', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'message' => 'Error fetching employees',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
