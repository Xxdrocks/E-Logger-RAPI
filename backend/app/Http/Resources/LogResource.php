<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "frequency" => $this->frequency,
            "10_28" => $this->ncs_1028,
            "waktu" => $this->waktu,
            "zzd" => $this->zzd,
            "nama" => $this->nama,
            "keterangan" => $this->keterangan,
            "dibuat_pada" => $this->created_at->format('d-m-Y H:i'),
        ];
    }
}
