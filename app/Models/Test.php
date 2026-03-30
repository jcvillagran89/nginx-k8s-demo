<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_request_id',
        'started_at',
        'finished_at',
    ];

    /**
     * Relación con la solicitud de prueba.
     */
    public function testRequest()
    {
        return $this->belongsTo(TestRequest::class);
    }

    /**
     * Cada test puede tener muchos resultados.
     */
    public function results()
    {
        return $this->hasMany(TestResult::class);
    }
}
