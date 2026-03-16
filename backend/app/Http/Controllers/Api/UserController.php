<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('id', 'desc')->get();
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

    public function bulkImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
        ]);

        try {
            $file = $request->file('file');
            $data = Excel::toArray([], $file);

            if (empty($data) || empty($data[0])) {
                return response()->json([
                    'success' => false,
                    'message' => 'File kosong atau format tidak valid',
                ], 400);
            }

            $rows = $data[0];
            $imported = 0;
            $skipped = 0;
            $errors = [];

            foreach ($rows as $index => $row) {
                if ($index === 0) continue;

                if (empty($row[1]) || empty($row[2])) {
                    $skipped++;
                    $errors[] = [
                        'row' => $index + 1,
                        'message' => 'NCS atau Nama kosong',
                    ];
                    continue;
                }

                $ncs = trim(strtoupper($row[1]));
                $nama = trim($row[2]);
                $role = 'member';

                $existingUser = User::where('ncs', $ncs)->first();
                if ($existingUser) {
                    $skipped++;
                    $errors[] = [
                        'row' => $index + 1,
                        'ncs' => $ncs,
                        'message' => 'NCS sudah terdaftar',
                    ];
                    continue;
                }

                $validator = Validator::make([
                    'ncs' => $ncs,
                    'nama' => $nama,
                    'role' => $role,
                ], [
                    'ncs' => 'required|string|max:20',
                    'nama' => 'required|string|max:255',
                    'role' => 'in:admin,member',
                ]);

                if ($validator->fails()) {
                    $errors[] = [
                        'row' => $index + 1,
                        'ncs' => $ncs,
                        'errors' => $validator->errors()->toArray(),
                    ];
                    $skipped++;
                    continue;
                }

                User::create([
                    'ncs' => $ncs,
                    'nama' => $nama,
                    'role' => $role,
                ]);

                $imported++;
            }

            return response()->json([
                'success' => true,
                'message' => "Import selesai: {$imported} berhasil, {$skipped} dilewati",
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat import',
                'error' => $e->getMessage(),
            ], 500);
        }
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
