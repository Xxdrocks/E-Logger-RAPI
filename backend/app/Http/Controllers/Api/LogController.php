<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\User;
use App\Models\Approval;
use App\Exports\LogsExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

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
            'keterangan' => 'nullable|string',
            'zzd' => 'nullable|string|max:2',
            'pencatat_ncs' => 'required|string',
            'pencatat_nama' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $today = now()->toDateString();

            // ✅ DUPLICATE CHECK
            $exists = Log::where('ncs_1028', $validated['ncs_1028'])
                ->where('keterangan', $validated['keterangan'])
                ->whereDate('created_at', $today)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => "NCS {$validated['ncs_1028']} sudah log hari ini"
                ], 422);
            }

            // ✅ AUTO GET USER
            $user = User::where('ncs', $validated['ncs_1028'])->first();
            $validated['nama'] = $user ? $user->nama : null;

            // ✅ AUTO ZZD
            $validated['zzd'] = $validated['zzd'] ?? substr($validated['ncs_1028'], 2, 2);

            $log = Log::create($validated);

            Approval::create([
                'log_id' => $log->id,
                ...$validated,
                'status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Log berhasil disimpan & menunggu approval',
                'data' => $log
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan log',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy(Log $log)
    {
        $log->delete();
        return response()->json(['message' => 'Log deleted']);
    }

    public function deleteAll()
    {
       Log::query()->delete();
        return response()->json(['message' => 'All logs deleted']);
    }

    public function export(Request $request)
    {
        $frequency = $request->input('frequency', '');
        $keterangan = $request->input('keterangan', 'semua_data');
        $pencatat_ncs = $request->input('pencatat_ncs', '');

        $date = now()->format('Y-m-d');
        $filename = "{$date}-{$pencatat_ncs}-{$keterangan}.xlsx";

        return Excel::download(new LogsExport($keterangan), $filename);
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
            'file' => 'required|file|mimes:xlsx,xls,csv',
            'frequency' => 'required|string',
            'keterangan' => 'nullable|string',
            'pencatat_ncs' => 'required|string',
            'pencatat_nama' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $rows = Excel::toArray([], $request->file('file'))[0];

            $imported = 0;
            $skipped = 0;
            $duplicates = 0;
            $today = now()->toDateString();

            foreach ($rows as $i => $row) {

                if (empty($row[0])) {
                    $skipped++;
                    continue;
                }

                $ncs = trim($row[0]);

                // ✅ DUPLICATE CHECK
                $exists = Log::where('ncs_1028', $ncs)
                    ->where('keterangan', $request->keterangan)
                    ->whereDate('created_at', $today)
                    ->exists();

                if ($exists) {
                    $duplicates++;
                    continue;
                }

                $user = User::where('ncs', $ncs)->first();

                $data = [
                    'frequency' => $request->frequency,
                    'keterangan' => $request->keterangan,
                    'ncs_1028' => $ncs,
                    'nama' => $user ? $user->nama : null,
                    'zzd' => substr($ncs, 2, 2),
                    'pencatat_ncs' => $request->pencatat_ncs,
                    'pencatat_nama' => $request->pencatat_nama,
                ];

                $log = Log::create($data);

                Approval::create([
                    'log_id' => $log->id,
                    ...$data,
                    'status' => 'pending',
                ]);

                $imported++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Import: {$imported} berhasil, {$duplicates} duplikat, {$skipped} kosong",
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Import gagal',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
