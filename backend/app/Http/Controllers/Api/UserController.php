<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('nama')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ncs' => 'required|string|max:20|unique:users',
            'nama' => 'required|string|max:255',
            'role' => 'nullable|in:admin,member',
        ]);

        $user = User::create([
            'ncs' => $validated['ncs'],
            'nama' => $validated['nama'],
            'role' => $validated['role'] ?? 'member',
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'ncs' => 'required|string|max:20|unique:users,ncs,' . $user->id,
            'nama' => 'required|string|max:255',
            'role' => 'nullable|in:admin,member',
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function searchNcs(Request $request)
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $users = User::where('ncs', 'like', '%' . $query . '%')
            ->orWhere('nama', 'like', '%' . $query . '%')
            ->limit(10)
            ->get(['ncs', 'nama']);

        return response()->json($users);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'ncs' => 'required|string|max:20|unique:users',
            'nama' => 'required|string|max:255',
            'role' => 'nullable|in:admin,member',
        ]);

        $user = User::create([
            'ncs' => $validated['ncs'],
            'nama' => $validated['nama'],
            'role' => $validated['role'] ?? 'member',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'ncs' => 'required|string',
        ]);

        $user = User::where('ncs', $request->ncs)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'ncs' => ['NCS tidak ditemukan. Silakan daftar terlebih dahulu.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
