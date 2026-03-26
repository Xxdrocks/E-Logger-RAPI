<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    use HasFactory;

    protected $fillable = [
        'ncs',
        'nama',
        'points',
    ];

    protected $casts = [
        'points' => 'integer',
    ];

    /**
     * Scope to get only users with points > 0
     */
    public function scopeHasPoints($query)
    {
        return $query->where('points', '>', 0);
    }

    /**
     * Get user details
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'ncs', 'ncs');
    }
}
