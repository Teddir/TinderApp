<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'age',
        'location',
        'pictures',
        'liked_threshold_notified_at',
    ];

    protected $casts = [
        'pictures' => 'array',
        'liked_threshold_notified_at' => 'datetime',
    ];

    public function feedback()
    {
        return $this->hasMany(PersonFeedback::class);
    }

    public function likes()
    {
        return $this->feedback()->where('feedback', 'like');
    }
}
