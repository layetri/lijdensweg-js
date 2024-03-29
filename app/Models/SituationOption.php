<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SituationOption extends Model
{
    use HasFactory;

    protected $fillable = ['description', 'situation_id', 'min_sanity', 'max_sanity', 'action'];
}
