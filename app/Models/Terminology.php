<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Terminology extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name_es',
        'display_name_en',
        'test_type_id',
    ];

    /**
     * Cada terminología pertenece a un tipo de prueba.
     */
    public function testType()
    {
        return $this->belongsTo(TestType::class);
    }
}
