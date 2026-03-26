<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Log;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class BackupController extends Controller
{
    public function downloadBackup()
    {
        try {
            $spreadsheet = new Spreadsheet();

            $usersSheet = $spreadsheet->getActiveSheet();
            $usersSheet->setTitle('Users');

            $usersSheet->setCellValue('A1', 'ID');
            $usersSheet->setCellValue('B1', 'NCS');
            $usersSheet->setCellValue('C1', 'Nama');
            $usersSheet->setCellValue('D1', 'Role');
            $usersSheet->setCellValue('E1', 'Created At');

            $usersSheet->getStyle('A1:E1')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4F46E5']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $users = User::orderBy('id', 'asc')->get();
            $row = 2;
            foreach ($users as $user) {
                $usersSheet->setCellValue('A' . $row, $user->id);
                $usersSheet->setCellValue('B' . $row, $user->ncs);
                $usersSheet->setCellValue('C' . $row, $user->nama);
                $usersSheet->setCellValue('D' . $row, $user->role);
                $usersSheet->setCellValue('E' . $row, $user->created_at);
                $row++;
            }

            foreach (range('A', 'E') as $col) {
                $usersSheet->getColumnDimension($col)->setAutoSize(true);
            }

            $logsSheet = $spreadsheet->createSheet();
            $logsSheet->setTitle('Logs');

            $logsSheet->setCellValue('A1', 'ID');
            $logsSheet->setCellValue('B1', 'NCS 10/28');
            $logsSheet->setCellValue('C1', 'Nama');
            $logsSheet->setCellValue('D1', 'Frequency');
            $logsSheet->setCellValue('E1', 'Keterangan');
            $logsSheet->setCellValue('F1', 'Session ID');
            $logsSheet->setCellValue('G1', 'Created At');

            $logsSheet->getStyle('A1:G1')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '10B981']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $logs = Log::orderBy('id', 'desc')->get();
            $row = 2;
            foreach ($logs as $log) {
                $logsSheet->setCellValue('A' . $row, $log->id);
                $logsSheet->setCellValue('B' . $row, $log->ncs_1028);
                $logsSheet->setCellValue('C' . $row, $log->nama);
                $logsSheet->setCellValue('D' . $row, $log->frequency);
                $logsSheet->setCellValue('E' . $row, $log->keterangan);
                $logsSheet->setCellValue('F' . $row, $log->session_id);
                $logsSheet->setCellValue('G' . $row, $log->created_at);
                $row++;
            }

            foreach (range('A', 'G') as $col) {
                $logsSheet->getColumnDimension($col)->setAutoSize(true);
            }

            $schedulesSheet = $spreadsheet->createSheet();
            $schedulesSheet->setTitle('Schedules');

            $schedulesSheet->setCellValue('A1', 'ID');
            $schedulesSheet->setCellValue('B1', 'Title');
            $schedulesSheet->setCellValue('C1', 'Event Date');
            $schedulesSheet->setCellValue('D1', 'Event Time');
            $schedulesSheet->setCellValue('E1', 'Lokasi');
            $schedulesSheet->setCellValue('F1', 'Pencatat NCS');
            $schedulesSheet->setCellValue('G1', 'Pencatat Nama');
            $schedulesSheet->setCellValue('H1', 'Created At');

            $schedulesSheet->getStyle('A1:H1')->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F59E0B']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ]);

            $schedules = Schedule::orderBy('event_date', 'asc')->get();
            $row = 2;
            foreach ($schedules as $schedule) {
                $schedulesSheet->setCellValue('A' . $row, $schedule->id);
                $schedulesSheet->setCellValue('B' . $row, $schedule->title);
                $schedulesSheet->setCellValue('C' . $row, $schedule->event_date);
                $schedulesSheet->setCellValue('D' . $row, $schedule->event_time);
                $schedulesSheet->setCellValue('E' . $row, $schedule->lokasi);
                $schedulesSheet->setCellValue('F' . $row, $schedule->pencatat_ncs);
                $schedulesSheet->setCellValue('G' . $row, $schedule->pencatat_nama);
                $schedulesSheet->setCellValue('H' . $row, $schedule->created_at);
                $row++;
            }

            foreach (range('A', 'H') as $col) {
                $schedulesSheet->getColumnDimension($col)->setAutoSize(true);
            }

            $spreadsheet->setActiveSheetIndex(0);

            $timestamp = now()->format('Y-m-d_His');
            $filename = "E-Logger_Backup_{$timestamp}.xlsx";

            $writer = new Xlsx($spreadsheet);

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Cache-Control: max-age=0');

            $writer->save('php://output');
            exit;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat backup: ' . $e->getMessage()
            ], 500);
        }
    }

    public function statsOverview()
    {
        try {
            $totalUsers = User::count();
            $totalSuperadmins = User::where('role', 'superadmin')->count();
            $totalAdmins = User::where('role', 'admin')->count();
            $totalMembers = User::where('role', 'member')->count();

            $totalLogs = Log::count();
            $logsToday = Log::whereDate('created_at', today())->count();
            $logsThisWeek = Log::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
            $logsThisMonth = Log::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();

            $totalSchedules = Schedule::count();
            $upcomingSchedules = Schedule::where('event_date', '>=', now()->toDateString())->count();
            $pastSchedules = Schedule::where('event_date', '<', now()->toDateString())->count();

            $recentLogs = Log::orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            $recentSchedules = Schedule::orderBy('event_date', 'desc')
                ->limit(5)
                ->get();

            $websiteLocked = false;
            $lockedUntil = null;
            $remainingMinutes = null;

            if (DB::getSchemaBuilder()->hasTable('settings')) {
                try {
                    $websiteLocked = $this->isWebsiteLocked();
                    $lockedUntil = $this->getSetting('locked_until');
                    $remainingMinutes = $this->getRemainingLockTime();
                } catch (\Exception $e) {
                }
            }

            return response()->json([
                'users' => [
                    'total' => $totalUsers,
                    'superadmins' => $totalSuperadmins,
                    'admins' => $totalAdmins,
                    'members' => $totalMembers,
                ],
                'logs' => [
                    'total' => $totalLogs,
                    'today' => $logsToday,
                    'this_week' => $logsThisWeek,
                    'this_month' => $logsThisMonth,
                    'recent' => $recentLogs,
                ],
                'schedules' => [
                    'total' => $totalSchedules,
                    'upcoming' => $upcomingSchedules,
                    'past' => $pastSchedules,
                    'recent' => $recentSchedules,
                ],
                'website_lock' => [
                    'is_locked' => $websiteLocked,
                    'locked_until' => $lockedUntil,
                    'remaining_minutes' => $remainingMinutes,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data stats: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle website lock (Superadmin only)
     */
    public function toggleWebsiteLock(Request $request)
    {
        $request->validate([
            'locked' => 'required|boolean',
            'unlock_at' => 'nullable|date',
        ]);

        try {
            $locked = $request->locked;
            $unlockAt = $request->unlock_at;

            $this->setSetting('website_locked', $locked ? 'true' : 'false');

            if ($locked && $unlockAt) {
                $this->setSetting('locked_until', $unlockAt);
            } else {
                $this->setSetting('locked_until', null);
            }

            return response()->json([
                'success' => true,
                'message' => $locked
                    ? "Website dikunci sampai {$unlockAt}"
                    : "Website dibuka kembali",
                'is_locked' => $locked,
                'locked_until' => $unlockAt,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal toggle website lock: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check website lock status (Public)
     */
    public function checkWebsiteLock()
    {
        try {
            $isLocked = $this->isWebsiteLocked();
            $lockedUntil = $this->getSetting('locked_until');
            $remainingMinutes = $this->getRemainingLockTime();

            return response()->json([
                'is_locked' => $isLocked,
                'locked_until' => $lockedUntil,
                'remaining_minutes' => $remainingMinutes,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'is_locked' => false,
                'locked_until' => null,
                'remaining_minutes' => null,
            ]);
        }
    }

    private function getSetting($key, $default = null)
    {
        if (!DB::getSchemaBuilder()->hasTable('settings')) {
            return $default;
        }

        $setting = DB::table('settings')->where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    private function setSetting($key, $value)
    {
        if (!DB::getSchemaBuilder()->hasTable('settings')) {
            return;
        }

        DB::table('settings')->updateOrInsert(
            ['key' => $key],
            ['value' => $value, 'updated_at' => now()]
        );
    }

    private function isWebsiteLocked()
    {
        $locked = $this->getSetting('website_locked', 'false');

        if ($locked === 'false') {
            return false;
        }

        $lockedUntil = $this->getSetting('locked_until');

        if ($lockedUntil) {
            $unlockTime = \Carbon\Carbon::parse($lockedUntil);

            if (now()->greaterThan($unlockTime)) {
                $this->setSetting('website_locked', 'false');
                $this->setSetting('locked_until', null);
                return false;
            }
        }
        return true;
    }

    private function getRemainingLockTime()
    {
        $lockedUntil = $this->getSetting('locked_until');

        if (!$lockedUntil) {
            return null;
        }

        $unlockTime = \Carbon\Carbon::parse($lockedUntil);

        if (now()->greaterThan($unlockTime)) {
            return 0;
        }

        return now()->diffInMinutes($unlockTime);
    }
}
