<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LeaveController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    // GET /api/leaves
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            Log::info('Fetching leaves for user', ['user_id' => $user->id, 'role' => $user->role]);

            if ($user->isAdmin()) {
                // Admin: see all leave requests with user details
                $leaves = Leave::with('user')->latest()->get();
            } else {
                // Employee: only their own leaves
                $leaves = $user->leaves()->latest()->get();
            }

            return response()->json($leaves);
        } catch (\Exception $e) {
            Log::error('Error fetching leaves', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error fetching leaves',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // POST /api/leaves
    public function store(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'required|date|after_or_equal:today',
                'end_date'   => 'required|date|after_or_equal:start_date',
                'reason'     => 'required|string',
                'type'       => 'required|in:annual,sick,unpaid',
            ]);

            $leave = $request->user()->leaves()->create([
                'start_date' => $request->start_date,
                'end_date'   => $request->end_date,
                'reason'     => $request->reason,
                'type'       => $request->type,
                'status'     => 'pending',
            ]);

            return response()->json($leave, 201);
        } catch (\Exception $e) {
            Log::error('Error creating leave request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error creating leave request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/leaves/{id}
    public function update(Request $request, $id)
    {
        try {
            Log::info('Leave update request received', [
                'leave_id' => $id,
                'request_data' => $request->all(),
                'user_id' => $request->user()->id,
                'user_role' => $request->user()->role
            ]);

            $user = $request->user();

            // Only admin can approve or reject
            if (!$user->isAdmin()) {
                Log::warning('Unauthorized leave update attempt', [
                    'user_id' => $user->id,
                    'leave_id' => $id
                ]);
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $request->validate([
                'status' => 'required|in:approved,rejected',
            ]);

            $leave = Leave::with('user')->findOrFail($id);
            Log::info('Found leave request', [
                'leave_id' => $leave->id,
                'current_status' => $leave->status,
                'new_status' => $request->status,
                'user_id' => $leave->user_id
            ]);

            $leave->status = $request->status;
            $leave->save();

            Log::info('Leave request updated successfully', [
                'leave_id' => $leave->id,
                'new_status' => $leave->status
            ]);

            return response()->json([
                'message' => 'Leave request updated successfully',
                'leave' => $leave
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating leave request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'leave_id' => $id,
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Error updating leave request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            $leave = Leave::with('user')->findOrFail($id);

            if (!$user->isAdmin() && $leave->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json($leave);
        } catch (\Exception $e) {
            Log::error('Error fetching leave details', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error fetching leave details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserLeaves($userId)
    {
        try {
            $authUser = auth()->user();

            // Allow if admin OR if requesting their own leaves
            if (!$authUser->isAdmin() && $authUser->id != $userId) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $user = \App\Models\User::findOrFail($userId);
            $leaves = $user->leaves()->with('user')->latest()->get();

            return response()->json($leaves);
        } catch (\Exception $e) {
            Log::error('Error fetching user leaves', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error fetching user leaves',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

