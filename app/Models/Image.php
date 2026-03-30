<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';

    // ❌ ELIMINA casts
    protected $casts = [];

    // Opcional
    protected $hidden = ['image'];
}
