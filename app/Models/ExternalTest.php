<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExternalTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'style_id',
        'style_number',
        'report_number',
        'reported_at',
        'lab',
        'color',
        'provider',
        'division',
        'department',
        'rejected_1',
        'rejected_2',
        'rejected_3',
        'rejected_4',
        'rejected_5',
        'rejected_6',
        'weigth',
        'composition',
        'status',
        'status_purchases',
        'released_at',
        'reprocesses',
        'action_taken',
        'cloth_provider',
        'generic_name',
        'comercial_name',
    ];

    public function style()
    {
        return $this->belongsTo(Style::class);
    }
}
