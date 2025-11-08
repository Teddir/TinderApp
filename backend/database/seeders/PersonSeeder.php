<?php

namespace Database\Seeders;

use App\Models\Person;
use App\Models\PersonFeedback;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = base_path('example-people.json');

        if (! File::exists($path)) {
            $this->command?->warn("example-people.json not found at {$path}. Skipping person seed.");
            return;
        }

        $people = json_decode(File::get($path), true);

        if (! is_array($people)) {
            $this->command?->warn('Unable to decode example-people.json. Skipping person seed.');
            return;
        }

        PersonFeedback::query()->delete();
        Person::query()->delete();

        collect($people)->each(function (array $payload) {
            Person::query()->create([
                'name' => $payload['name'],
                'age' => (int) $payload['age'],
                'location' => $payload['location'],
                'pictures' => $payload['pictures'] ?? [],
            ]);
        });
    }
}
