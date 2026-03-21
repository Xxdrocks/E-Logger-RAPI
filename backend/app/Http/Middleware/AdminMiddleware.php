<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!in_array($user->role, ['admin', 'superadmin'])) {
            return response()->json([
                'message' => 'Forbidden: Admin or Superadmin access required',
                'your_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}
