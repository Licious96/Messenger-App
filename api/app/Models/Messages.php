<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Contacts;

class Messages extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_one',
        'user_two',
        'conv_id',
        'text',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function contacts(){
        return $this->belongsTo(Contacts::class);
    }

}
