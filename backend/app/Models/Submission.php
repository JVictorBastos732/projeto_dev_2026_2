<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Submission extends Model
{
    protected $fillable = [
        'author_name', 'author_email', 'category_id', 'title',
        'resume', 'file_path', 'protocol', 'desired_date', 'status',
    ];

    protected $casts = [
        'desired_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Submission $submissao) {
            // Protocolo curto e único pro autor consultar o status sem precisar de login.
            // Ex: SUB-2026-A3F9K2
            $submissao->protocol = 'SUB-' . now()->year . '-' . strtoupper(Str::random(6));
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
