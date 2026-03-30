<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_es',
        'name_en',
        'description',
    ];

    public function terminologies()
    {
        return $this->hasMany(Terminology::class);
    }

}
