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
            "id"          => $this->id,
            "frequency"   => $this->frequency,
            "ncs_1028"    => $this->ncs_1028,
            "waktu"       => $this->created_at->format('d-m-Y H:i'),
            "zzd"         => $this->zzd,
            "nama"        => $this->nama,
            "keterangan"  => $this->keterangan,
        ];
    }
}
