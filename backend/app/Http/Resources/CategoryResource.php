<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'deadline' => $this->deadline,
            'vacancies' => $this->vacancies,
            'active' => $this->active,
            'vacancies_left' => $this->vacancies_left,
            'is_full' => $this->is_full,
            'is_expired' => $this->is_expired,
            'is_open' => $this->is_open,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
