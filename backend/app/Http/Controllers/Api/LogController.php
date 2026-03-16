<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\User;
use App\Exports\LogsExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class LogController extends Controller
{
    public function index()
    {
        $logs = Log::latest()->get();
        return response()->json(['data' => $logs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'frequency' => 'required|string',
            'ncs_1028' => 'required|string',
            'zzd' => 'nullable|string',
            'nama' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'pencatat_ncs' => 'nullable|string',
            'pencatat_nama' => 'nullable|string',
        ]);

        $user = User::where('ncs', $validated['ncs_1028'])->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'NCS belum terdaftar di database. Silakan hubungi admin.'
            ], 422);
        }

        $log = Log::create($validated);
        return response()->json($log, 201);
    }

    public function destroy(Log $log)
    {
        $log->delete();
        return response()->json(['message' => 'Log deleted']);
    }

    public function deleteAll()
    {
        Log::truncate();
        return response()->json(['message' => 'All logs deleted']);
    }

    public function export(Request $request)
    {
        $keterangan = $request->input('keterangan', 'semua_data');
        return Excel::download(new LogsExport($keterangan), 'logs.xlsx');
    }

    public function searchNcs(Request $request)
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $users = User::where('ncs', 'like', "%{$query}%")
            ->orWhere('nama', 'like', "%{$query}%")
            ->limit(10)
            ->get(['ncs', 'nama']);

        return response()->json($users);
    }

    public function bulkImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
            'frequency' => 'required|string',
            'keterangan' => 'nullable|string',
            'pencatat_ncs' => 'required|string',
            'pencatat_nama' => 'nullable|string',
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
                if (empty($row[0])) {
                    $skipped++;
                    continue;
                }

                $ncs = trim(strtoupper($row[0]));

                $user = User::where('ncs', $ncs)->first();
                if (!$user) {
                    $errors[] = [
                        'row' => $index + 1,
                        'ncs' => $ncs,
                        'message' => 'NCS tidak terdaftar',
                    ];
                    $skipped++;
                    continue;
                }

                $zzd = (strlen($ncs) >= 4) ? substr($ncs, 2, 2) : '';

                Log::create([
                    'frequency' => $request->frequency,
                    'keterangan' => $request->keterangan,
                    'ncs_1028' => $ncs,
                    'nama' => $user->nama,
                    'zzd' => $zzd,
                    'pencatat_ncs' => $request->pencatat_ncs,
                    'pencatat_nama' => $request->pencatat_nama,
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
}
