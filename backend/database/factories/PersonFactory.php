<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Person>
 */
class PersonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'age' => $this->faker->numberBetween(21, 45),
            'location' => $this->faker->city() . ', ' . $this->faker->country(),
            'pictures' => [
                $this->faker->imageUrl(900, 1200, 'people', true),
                $this->faker->imageUrl(900, 1200, 'people', true),
            ],
        ];
    }
}
