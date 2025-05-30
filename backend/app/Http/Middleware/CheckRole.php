<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized. Please login.'], 401);
        }

        $user = Auth::user();
        
        if ($user->role !== $role) {
            return response()->json([
                'message' => 'Unauthorized. Insufficient permissions.',
                'user_role' => $user->role,
                'required_role' => $role
            ], 403);
        }

        return $next($request);
    }
} 