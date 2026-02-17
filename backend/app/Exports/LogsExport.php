<?php

namespace App\Exports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LogsExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Log::select('frequency', 'ncs_1028', 'zzd', 'nama', 'keterangan')->get();
    }

    public function headings(): array
    {
        return ['FREQ', '10/28', 'ZZD', 'NAMA', 'KETERANGAN'];
    }
}