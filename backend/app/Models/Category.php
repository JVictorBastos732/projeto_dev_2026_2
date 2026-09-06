<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'title', 'description', 'deadline', 'vacancies', 'active',
    ];

    protected $casts = [
        'prazo_final' => 'date',
        'ativa' => 'boolean',
    ];

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
