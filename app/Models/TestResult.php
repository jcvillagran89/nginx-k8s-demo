<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Casts\ContentWithUserCast;

class TestResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_id',
        'content',
    ];

    protected $casts = [
        'content' => ContentWithUserCast::class,
    ];

    protected $appends = ['test_names'];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function getTestNamesAttribute()
    {
        if (!is_array($this->content)) {
            return [];
        }

        return array_keys($this->content);
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'test_result_id');
    }

}
