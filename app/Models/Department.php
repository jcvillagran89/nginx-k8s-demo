<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'description',
        'division_id',
    ];

    public function styles()
    {
        return $this->hasMany(Style::class);
    }
}
