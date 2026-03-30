<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'date',
        'provider_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function styles()
    {
        return $this->hasMany(Style::class);
    }
}
