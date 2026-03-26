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
            'zzd' => 'nullable|string',
            'nama' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'pencatat_ncs' => 'nullable|string',
            'pencatat_nama' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            $user = User::where('ncs', $validated['ncs_1028'])->first();
            if (!$user) {
                $validated['nama'] = null;
            } else {
                $validated['nama'] = $user->nama;
            }


            $log = Log::create($validated);


            Approval::create([
                'log_id' => $log->id,
                'frequency' => $validated['frequency'],
                'keterangan' => $validated['keterangan'],
                'ncs_1028' => $validated['ncs_1028'],
                'nama' => $validated['nama'],
                'zzd' => $validated['zzd'],
                'pencatat_ncs' => $validated['pencatat_ncs'],
                'pencatat_nama' => $validated['pencatat_nama'],
                'status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Log berhasil disimpan. Menunggu approval admin.',
                'log' => $log
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
        Log::truncate();
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
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
            'frequency' => 'required|string',
            'keterangan' => 'nullable|string',
            'pencatat_ncs' => 'required|string',
            'pencatat_nama' => 'nullable|string',
        ]);

        DB::beginTransaction();

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
                $nama = $user ? $user->nama : null;
                $zzd = (strlen($ncs) >= 4) ? substr($ncs, 2, 2) : '';

                $log = Log::create([
                    'frequency' => $request->frequency,
                    'keterangan' => $request->keterangan,
                    'ncs_1028' => $ncs,
                    'nama' => $nama,
                    'zzd' => $zzd,
                    'pencatat_ncs' => $request->pencatat_ncs,
                    'pencatat_nama' => $request->pencatat_nama,
                ]);

                Approval::create([
                    'log_id' => $log->id,
                    'frequency' => $request->frequency,
                    'keterangan' => $request->keterangan,
                    'ncs_1028' => $ncs,
                    'nama' => $nama,
                    'zzd' => $zzd,
                    'pencatat_ncs' => $request->pencatat_ncs,
                    'pencatat_nama' => $request->pencatat_nama,
                    'status' => 'pending',
                ]);

                $imported++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Import selesai: {$imported} berhasil, {$skipped} dilewati. Menunggu approval admin.",
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat import',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
