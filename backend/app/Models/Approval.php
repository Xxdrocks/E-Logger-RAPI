<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{
    use HasFactory;

    protected $fillable = [
        'log_id',
        'frequency',
        'keterangan',
        'ncs_1028',
        'nama',
        'zzd',
        'pencatat_ncs',
        'pencatat_nama',
        'status', 
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Relationship to Log
     */
    public function log()
    {
        return $this->belongsTo(Log::class);
    }

    /**
     * Relationship to User who approved
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
