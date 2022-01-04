<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMessages extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_one',
        'username',
        'conv_id',
        'text',
        'image',
    ];
}
