<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Approval;
use App\Models\User;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApprovalController extends Controller
{
    const POINTS_PER_PENCATAT = 2;
    const POINTS_PER_PARTICIPANT = 1;

    /**
     * Get all pending approvals
     */
    public function index()
    {
        $approvals = Approval::with('log')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($approvals);
    }

    /**
     * Approve a log entry - add points to users table
     */
    public function approve($id)
    {
        DB::beginTransaction();

        try {
            $approval = Approval::findOrFail($id);

            if ($approval->status !== 'pending') {
                return response()->json([
                    'message' => 'Approval sudah diproses sebelumnya'
                ], 400);
            }

            $approval->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => auth()->id()
            ]);

            $pencatat = User::where('ncs', $approval->pencatat_ncs)->first();
            if ($pencatat) {
                $pencatat->increment('points', self::POINTS_PER_PENCATAT);
                $pencatat->increment('total_as_pencatat');
                $pencatat->update(['points_last_updated' => now()]);
            }

            $participant = User::where('ncs', $approval->ncs_1028)->first();
            if ($participant) {
                $participant->increment('points', self::POINTS_PER_PARTICIPANT);
                $participant->increment('total_as_participant');
                $participant->update(['points_last_updated' => now()]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Log berhasil di-approve dan poin sudah ditambahkan',
                'approval' => $approval
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal approve log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a log entry - no points added
     */
    public function reject($id)
    {
        try {
            $approval = Approval::findOrFail($id);

            if ($approval->status !== 'pending') {
                return response()->json([
                    'message' => 'Approval sudah diproses sebelumnya'
                ], 400);
            }

            $approval->update([
                'status' => 'rejected',
                'approved_at' => now(),
                'approved_by' => auth()->id()
            ]);

            return response()->json([
                'message' => 'Log berhasil di-reject, poin tidak ditambahkan',
                'approval' => $approval
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal reject log',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete approval (admin only)
     */
    public function destroy($id)
    {
        try {
            $approval = Approval::findOrFail($id);

            // Delete related log if exists
            if ($approval->log_id) {
                Log::find($approval->log_id)?->delete();
            }

            $approval->delete();

            return response()->json([
                'message' => 'Approval berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus approval',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
