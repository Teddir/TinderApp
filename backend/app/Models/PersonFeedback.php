<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonFeedback extends Model
{
    use HasFactory;

    protected $table = 'person_feedback';

    protected $fillable = [
        'person_id',
        'user_identifier',
        'feedback',
    ];

    public function person()
    {
        return $this->belongsTo(Person::class);
    }
}
