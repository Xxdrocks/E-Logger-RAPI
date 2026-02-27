<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use SoftDeletes;

    protected $fillable = [
       'title',
        'description',
        'location',
        'event_date',
        'event_time',
        'image',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];
}
