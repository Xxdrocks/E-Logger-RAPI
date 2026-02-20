<?php

namespace App\Exports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class LogsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Log::orderBy('created_at')->get();
    }

    public function headings(): array
    {
        return [
            'NO',
            'TANGGAL',
            'FREKUENSI',
            'NCS',
            '10-28',
            'WAKTU',
            'ZZD',
            'NAMA',
            'KEGIATAN'
        ];
    }

    public function map($log): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $log->created_at->format('d F Y'),
            $log->frequency . ' MHz',
            $log->pencatat_ncs ?? '-',
            $log->ncs_1028,
            $log->created_at->format('H.i.s'),
            $log->zzd ?? '-',
            $log->nama ?: '10-28 Belum Terinput di Database',
            $log->keterangan ?? '-',
        ];
    }
}
