<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use Illuminate\Http\Request;
use App\Http\Requests\LogRequest;
use App\Http\Resources\LogResource;
use Illuminate\Support\Facades\DB;
use App\Exports\LogsExport;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $query = Log::query();
        if ($request->search) {
            $query->where('ncs_1028', 'like', "%{$request->search}%")
                ->orWhere('nama', 'like', "%{$request->search}%");
        }
        if ($request->tanggal) {
            $query->whereDate('created_at', $request->tanggal);
        }
        if ($request->sort_by && $request->order) {
            $query->orderBy($request->sort_by, $request->order);
        } else {
            $query->latest();
        }
        $logs = $query->paginate(20);
        return LogResource::collection($logs);
    }

    public function store(LogRequest $request)
    {
        DB::beginTransaction();
        try {
            $log = Log::create($request->validated());
            DB::commit();
            return response()->json([
                "success" => true,
                "message" => "Log berhasil ditambahkan",
                "data" => new LogResource($log)
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                "success" => false,
                "message" => "Terjadi kesalahan",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $log = Log::find($id);

        if (!$log) {
            return response()->json([
                "success" => false,
                "message" => "Data tidak ditemukan"
            ], 404);
        }

        return new LogResource($log);
    }

    public function destroy($id)
    {
        $log = Log::find($id);

        if (!$log) {
            return response()->json([
                "success" => false,
                "message" => "Data tidak ditemukan"
            ], 404);
        }

        $log->delete();

        return response()->json([
            "success" => true,
            "message" => "Data berhasil dihapus"
        ]);
    }

    public function deleteAll()
    {
        Log::query()->delete();

        return response()->json([
            "success" => true,
            "message" => "Semua data berhasil dihapus"
        ]);
    }

    public function restore($id)
    {
        $log = Log::withTrashed()->find($id);

        if (!$log) {
            return response()->json([
                "success" => false,
                "message" => "Data tidak ditemukan"
            ], 404);
        }

        $log->restore();

        return response()->json([
            "success" => true,
            "message" => "Data berhasil direstore"
        ]);
    }

    public function export(Request $request)
    {
        $keterangan = $request->keterangan ?? 'semua_data';
        $keterangan = preg_replace('/[^A-Za-z0-9\-]/', '_', $keterangan);
        $tanggal = now()->format('d-m-Y');
        $fileName = "{$tanggal}_{$keterangan}.xlsx";

        return Excel::download(new LogsExport, $fileName);
    }

    public function searchNcs(Request $request)
    {
        $operators = \App\Models\Operator::where('ncs', 'like', "%{$request->q}%")
            ->limit(5)
            ->get(['ncs', 'nama']);

        return response()->json($operators);
    }

    public function indexOperators()
    {
        $operators = \App\Models\Operator::orderBy('ncs')->get();
        return response()->json($operators);
    }

    public function storeOperator(Request $request)
    {
        $request->validate([
            'ncs'  => 'required|string|max:20|unique:operators,ncs',
            'nama' => 'required|string|max:100',
        ]);

        $operator = \App\Models\Operator::create($request->only('ncs', 'nama'));
        return response()->json($operator, 201);
    }

    public function updateOperator(Request $request, $id)
    {
        $operator = \App\Models\Operator::findOrFail($id);

        $request->validate([
            'ncs'  => 'required|string|max:20|unique:operators,ncs,' . $id,
            'nama' => 'required|string|max:100',
        ]);

        $operator->update($request->only('ncs', 'nama'));
        return response()->json($operator);
    }

    public function destroyOperator($id)
    {
        \App\Models\Operator::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
