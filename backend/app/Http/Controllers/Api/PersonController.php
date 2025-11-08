<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PersonFeedbackRequest;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use App\Models\PersonFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PersonController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $this->perPage($request);
        $userIdentifier = $request->query('user_identifier');

        $people = Person::query()
            ->withCount([
                'feedback as likes_count' => fn ($query) => $query->where('feedback', 'like'),
                'feedback as dislikes_count' => fn ($query) => $query->where('feedback', 'dislike'),
            ])
            ->when($userIdentifier, function ($query) use ($userIdentifier) {
                $query->whereDoesntHave('feedback', function ($feedbackQuery) use ($userIdentifier) {
                    $feedbackQuery->where('user_identifier', $userIdentifier);
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return PersonResource::collection($people);
    }

    public function liked(Request $request)
    {
        $perPage = $this->perPage($request);
        $userIdentifier = $request->query('user_identifier');

        $people = Person::query()
            ->withCount([
                'feedback as likes_count' => fn ($query) => $query->where('feedback', 'like'),
            ])
            ->when($userIdentifier, function ($query) use ($userIdentifier) {
                $query->whereHas('feedback', function ($feedbackQuery) use ($userIdentifier) {
                    $feedbackQuery
                        ->where('feedback', 'like')
                        ->where('user_identifier', $userIdentifier);
                });
            }, function ($query) {
                $query->having('likes_count', '>=', 1);
            })
            ->orderByDesc('likes_count')
            ->paginate($perPage);

        return PersonResource::collection($people);
    }

    public function like(PersonFeedbackRequest $request, Person $person)
    {
        return $this->recordFeedback($request, $person, 'like');
    }

    public function dislike(PersonFeedbackRequest $request, Person $person)
    {
        return $this->recordFeedback($request, $person, 'dislike');
    }

    public function summary(Request $request): JsonResponse
    {
        $userIdentifier = $request->query('user_identifier');

        if (! $userIdentifier) {
            return response()->json([
                'data' => [
                    'likes_count' => 0,
                    'passed_count' => 0,
                    'remaining_count' => Person::query()->count(),
                ],
            ]);
        }

        $likesCount = PersonFeedback::query()
            ->where('user_identifier', $userIdentifier)
            ->where('feedback', 'like')
            ->count();

        $passedCount = PersonFeedback::query()
            ->where('user_identifier', $userIdentifier)
            ->where('feedback', 'dislike')
            ->count();

        $remainingCount = Person::query()
            ->whereDoesntHave('feedback', function ($query) use ($userIdentifier) {
                $query->where('user_identifier', $userIdentifier);
            })
            ->count();

        return response()->json([
            'data' => [
                'likes_count' => $likesCount,
                'passed_count' => $passedCount,
                'remaining_count' => $remainingCount,
            ],
        ]);
    }

    protected function recordFeedback(PersonFeedbackRequest $request, Person $person, string $feedback)
    {
        PersonFeedback::updateOrCreate(
            [
                'person_id' => $person->id,
                'user_identifier' => $request->validated('user_identifier'),
            ],
            ['feedback' => $feedback]
        );

        $person->loadCount([
            'feedback as likes_count' => fn ($query) => $query->where('feedback', 'like'),
            'feedback as dislikes_count' => fn ($query) => $query->where('feedback', 'dislike'),
        ]);

        return (new PersonResource($person))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    protected function perPage(Request $request): int
    {
        $perPage = (int) $request->query('per_page', 10);
        return max(1, min($perPage, 50));
    }
}
