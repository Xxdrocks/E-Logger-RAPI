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
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

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
            'NCS',
            '10-28',
            'WAKTU',
            'ZZD',
            'NAMA',
        ];
    }

    public function map($log): array
    {
        static $no = 0;
        $no++;

        $nama = $log->nama ?: '-';

        return [
            $no,
            \PhpOffice\PhpSpreadsheet\Shared\Date::dateTimeToExcel(
                $log->created_at->startOfDay()
            ),
            $log->pencatat_ncs ?? '-',
            $log->ncs_1028,
            $log->created_at->format('H:i:s'),
            $log->zzd ? (int) $log->zzd : '-',
            $nama,

        ];
    }

    public function styles(Worksheet $sheet)
    {

        $sheet->getStyle('B2:B1000')
            ->getNumberFormat()
            ->setFormatCode('[$-id-ID]d mmmm yyyy');

        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

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
