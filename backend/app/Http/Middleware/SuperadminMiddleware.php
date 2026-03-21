<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SuperadminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->role !== 'superadmin') {
            return response()->json([
                'message' => 'Forbidden: Superadmin access required',
                'your_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}
