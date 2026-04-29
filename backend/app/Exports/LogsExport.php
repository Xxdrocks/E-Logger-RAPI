<?php

namespace App\Exports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class LogsExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $keterangan;
    protected $sessionId;

    public function __construct($keterangan = null, $sessionId = null)
    {
        $this->keterangan = $keterangan;
        $this->sessionId = $sessionId;
    }

    public function collection()
    {

        $query = Log::orderBy('created_at');

        if ($this->sessionId) {
            $query->where('session_id', $this->sessionId);
        }

        if ($this->keterangan && $this->keterangan !== 'semua_data') {
            $query->where('keterangan', $this->keterangan);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'NO',
            'TANGGAL',
            'FREKUENSI',
            'NCS PENCATAT',
            '10-28',
            'WAKTU',
            'ZZD',
            'NAMA',
            'KETERANGAN',
            'STATUS'
        ];
    }

    public function map($log): array
    {
        static $no = 0;
        $no++;

        $status = $log->nama ? 'Terdaftar' : '10-28 Belum Terdaftar di Database';
        $nama = $log->nama ?: '-';

        return [
            $no,
            $log->created_at->format('d F Y'),
            $log->frequency,
            $log->pencatat_ncs ?? '-',
            $log->ncs_1028,
            $log->created_at->format('H:i:s'),
            $log->zzd ?? '-',
            $nama,
            $log->keterangan ?? '-',
            $status
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4F46E5']
                ],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }
}
