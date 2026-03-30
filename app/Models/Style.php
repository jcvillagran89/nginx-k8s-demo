<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ExternalTest;
use App\Models\InternalTest;

class Style extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'provider_id',
        'description',
        'order_id',
        'department_id',
        'weight',
        'cloth_provider',
        'cloth_name',
        'generic_name',
        'comercial_name',
        'china_style',
        'laboratory',
        'laboratory_delivery_date',
    ];

    protected $appends = ['image'];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function externalTests()
    {
        return $this->hasMany(ExternalTest::class);
    }

    public function internalTests()
    {
        return $this->hasMany(InternalTest::class, 'style_number', 'number');
    }

    public function getImageAttribute()
    {
        return route('styles.image', ['number' => $this->number]);
    }
}
