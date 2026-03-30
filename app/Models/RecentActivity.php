<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecentActivity extends Model
{
    protected $fillable = [
        'user_id', 'title', 'description', 'icon', 'type'
    ];

    public const ICONS = [
        'primary' => 'tabler:info-circle',
        'success' => 'tabler:circle-check',
        'info'    => 'tabler:bell',
        'warning' => 'tabler:alert-triangle',
        'danger'  => 'tabler:alert-octagon',
    ];

    public const TYPES = [
        'primary',
        'success',
        'info',
        'warning',
        'danger',
    ];

    public function setTypeAttribute($value)
    {
        $this->attributes['type'] = in_array($value, self::TYPES)
            ? $value
            : 'primary';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
