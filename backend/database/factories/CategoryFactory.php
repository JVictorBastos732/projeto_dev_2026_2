<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'deadline' => now()->addMonth(),
            'vacancies' => 20,
            'active' => true,
        ];
    }

    public function inativa(): static
    {
        return $this->state(['active' => false]);
    }
}
