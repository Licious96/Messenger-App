<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Messages;

class Contacts extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_one',
        'user_two',
        'conv_id',
    ];

    public function messages(){
        return $this->hasMany(Messages::class);
    }
}
