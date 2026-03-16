<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'ncs',
        'nama',
        'role',
        'points',
        'total_as_pencatat',
        'total_as_participant',
        'points_last_updated',
    ];

     protected $casts = [
        'points' => 'integer',
        'total_as_pencatat' => 'integer',
        'total_as_participant' => 'integer',
        'points_last_updated' => 'datetime',
    ];

    public function logs()
    {
        return $this->hasMany(Log::class, 'ncs_1028', 'ncs');
    }

    public function logsAsPencatat()
    {
        return $this->hasMany(Log::class, 'pencatat_ncs', 'ncs');
    }
    
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMember(): bool
    {
        return $this->role === 'member';
    }
}
