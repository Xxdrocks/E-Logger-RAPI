<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PointController extends Controller
{
    const POINTS_PER_PENCATAT = 2;
    const POINTS_PER_PARTICIPANT = 1;

    public function leaderboard(Request $request)
    {
        $filter = $request->input('filter', 'all');

        $users = User::select('id', 'ncs', 'nama', 'role', 'points', 'total_as_pencatat', 'total_as_participant')
            ->orderBy('points', 'desc')
            ->get();

        $leaderboard = $users->map(function ($user, $index) use ($filter) {
            $pencatatCount = $this->getPencatatCount($user->ncs, $filter);
            $participantCount = $this->getParticipantCount($user->ncs, $filter);
            $points = ($pencatatCount * self::POINTS_PER_PENCATAT) + ($participantCount * self::POINTS_PER_PARTICIPANT);

            return [
                'rank' => $index + 1,
                'ncs' => $user->ncs,
                'nama' => $user->nama,
                'role' => $user->role,
                'total_pencatat' => $pencatatCount,
                'total_hadir' => $participantCount,
                'points' => $points,
            ];
        });

        $leaderboard = $leaderboard->sortByDesc('points')->values();

        $leaderboard = $leaderboard->map(function ($item, $index) {
            $item['rank'] = $index + 1;
            return $item;
        });

        return response()->json($leaderboard);
    }

    public function userDetail($ncs, Request $request)
    {
        $filter = $request->input('filter', 'all');

        $user = User::where('ncs', $ncs)->firstOrFail();

        $pencatatCount = $this->getPencatatCount($ncs, $filter);
        $participantCount = $this->getParticipantCount($ncs, $filter);
        $points = ($pencatatCount * self::POINTS_PER_PENCATAT) + ($participantCount * self::POINTS_PER_PARTICIPANT);

        $pencatatLogs = $this->getPencatatLogs($ncs, $filter);
        $participantLogs = $this->getParticipantLogs($ncs, $filter);

        return response()->json([
            'user' => [
                'ncs' => $user->ncs,
                'nama' => $user->nama,
                'role' => $user->role,
            ],
            'stats' => [
                'total_pencatat' => $pencatatCount,
                'total_hadir' => $participantCount,
                'points' => $points,
            ],
            'breakdown' => [
                'pencatat' => $pencatatLogs,
                'hadir' => $participantLogs,
            ],
        ]);
    }

    public function recalculateAll()
    {
        $users = User::all();

        foreach ($users as $user) {
            $pencatatCount = Log::where('pencatat_ncs', $user->ncs)->count();
            $participantCount = Log::where('ncs_1028', $user->ncs)->count();
            $points = ($pencatatCount * self::POINTS_PER_PENCATAT) + ($participantCount * self::POINTS_PER_PARTICIPANT);

            $user->update([
                'total_as_pencatat' => $pencatatCount,
                'total_as_participant' => $participantCount,
                'points' => $points,
                'points_last_updated' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Points recalculated for all users',
            'total_users' => $users->count(),
        ]);
    }

    private function getPencatatCount($ncs, $filter)
    {
        $query = Log::where('pencatat_ncs', $ncs);

        if ($filter === 'month') {
            $query->whereYear('created_at', now()->year)
                  ->whereMonth('created_at', now()->month);
        } elseif ($filter === 'year') {
            $query->whereYear('created_at', now()->year);
        }

        return $query->count();
    }

    private function getParticipantCount($ncs, $filter)
    {
        $query = Log::where('ncs_1028', $ncs);

        if ($filter === 'month') {
            $query->whereYear('created_at', now()->year)
                  ->whereMonth('created_at', now()->month);
        } elseif ($filter === 'year') {
            $query->whereYear('created_at', now()->year);
        }

        return $query->count();
    }

    private function getPencatatLogs($ncs, $filter)
    {
        $query = Log::where('pencatat_ncs', $ncs);

        if ($filter === 'month') {
            $query->whereYear('created_at', now()->year)
                  ->whereMonth('created_at', now()->month);
        } elseif ($filter === 'year') {
            $query->whereYear('created_at', now()->year);
        }

        return $query->select('id', 'frequency', 'keterangan', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();
    }

    private function getParticipantLogs($ncs, $filter)
    {
        $query = Log::where('ncs_1028', $ncs);

        if ($filter === 'month') {
            $query->whereYear('created_at', now()->year)
                  ->whereMonth('created_at', now()->month);
        } elseif ($filter === 'year') {
            $query->whereYear('created_at', now()->year);
        }

        return $query->select('id', 'frequency', 'pencatat_ncs', 'pencatat_nama', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();
    }
}
