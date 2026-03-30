<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sku extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'name',
        'style_id',
    ];

    public function style()
    {
        return $this->belongsTo(Style::class);
    }
}
