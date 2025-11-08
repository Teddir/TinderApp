<?php

namespace Tests\Feature;

use App\Models\Person;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PersonApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_people(): void
    {
        Person::factory()->count(3)->create();

        $response = $this->getJson('/api/people');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'age', 'location', 'pictures'],
                ],
                'links',
                'meta',
            ]);
    }

    public function test_can_like_person(): void
    {
        $person = Person::factory()->create();

        $response = $this->postJson("/api/people/{$person->id}/like", [
            'user_identifier' => 'user-123',
        ]);

        $response->assertOk()->assertJsonPath('data.likes_count', 1);
        $this->assertDatabaseHas('person_feedback', [
            'person_id' => $person->id,
            'user_identifier' => 'user-123',
            'feedback' => 'like',
        ]);
    }

    public function test_like_can_be_switched_to_dislike(): void
    {
        $person = Person::factory()->create();

        $this->postJson("/api/people/{$person->id}/like", [
            'user_identifier' => 'user-123',
        ]);

        $response = $this->postJson("/api/people/{$person->id}/dislike", [
            'user_identifier' => 'user-123',
        ]);

        $response->assertOk()->assertJsonPath('data.dislikes_count', 1);

        $this->assertDatabaseHas('person_feedback', [
            'person_id' => $person->id,
            'user_identifier' => 'user-123',
            'feedback' => 'dislike',
        ]);
    }

    public function test_people_endpoint_excludes_already_swiped_people(): void
    {
        $seen = Person::factory()->create();
        $other = Person::factory()->create();

        $userIdentifier = 'user-xyz';

        $this->postJson("/api/people/{$seen->id}/like", [
            'user_identifier' => $userIdentifier,
        ])->assertOk();

        $response = $this->getJson('/api/people?user_identifier='.$userIdentifier);

        $response->assertOk();

        $ids = collect($response->json('data'))->pluck('id');

        $this->assertFalse($ids->contains($seen->id));
        $this->assertTrue($ids->contains($other->id));
    }

    public function test_liked_endpoint_returns_user_likes(): void
    {
        [$likedByUser, $likedByOther] = Person::factory()->count(2)->create();

        $userIdentifier = 'user-abc';
        $otherIdentifier = 'user-def';

        $this->postJson("/api/people/{$likedByUser->id}/like", [
            'user_identifier' => $userIdentifier,
        ])->assertOk();

        $this->postJson("/api/people/{$likedByOther->id}/like", [
            'user_identifier' => $otherIdentifier,
        ])->assertOk();

        $response = $this->getJson('/api/people/liked?user_identifier='.$userIdentifier);

        $response->assertOk();
        $ids = collect($response->json('data'))->pluck('id');

        $this->assertTrue($ids->contains($likedByUser->id));
        $this->assertFalse($ids->contains($likedByOther->id));
    }

    public function test_summary_returns_counts_for_user(): void
    {
        $likedPerson = Person::factory()->create();
        $passedPerson = Person::factory()->create();

        $userIdentifier = 'user-summary';

        $this->postJson("/api/people/{$likedPerson->id}/like", [
            'user_identifier' => $userIdentifier,
        ])->assertOk();

        $this->postJson("/api/people/{$passedPerson->id}/dislike", [
            'user_identifier' => $userIdentifier,
        ])->assertOk();

        $response = $this->getJson('/api/people/summary?user_identifier='.$userIdentifier);

        $response
            ->assertOk()
            ->assertJson([
                'data' => [
                    'likes_count' => 1,
                    'passed_count' => 1,
                ],
            ]);
    }
}

