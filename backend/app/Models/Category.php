<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
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

    public function getVacanciesLeftAttribute(): ?int
{
    if ($this->vacancies === null) {
        return null; // sem limite de vagas definido
    }

    $occupied = $this->submissions()
        ->whereIn('status', ['pending', 'confirmed'])
        ->count();

    return max(0, $this->vacancies - $occupied);
}

public function getIsFullAttribute(): bool
{
    return $this->vacancies_left !== null && $this->vacancies_left <= 0;
}

public function getIsExpiredAttribute(): bool
{
    return $this->deadline !== null && now()->startOfDay()->gt($this->deadline);
}

public function getIsOpenAttribute(): bool
{
    return $this->active && ! $this->is_full && ! $this->is_expired;
}
}
