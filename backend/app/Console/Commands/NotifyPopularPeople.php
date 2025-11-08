<?php

namespace App\Console\Commands;

use App\Mail\PopularPersonNotification;
use App\Models\Person;
use Illuminate\Support\Facades\Mail;
use Illuminate\Console\Command;

class NotifyPopularPeople extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-popular-people {--threshold=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify the admin when any person crosses the configured like threshold';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = (int) ($this->option('threshold') ?? config('people.popular_like_threshold'));
        $adminEmail = config('people.admin_email');

        if (! $adminEmail) {
            $this->warn('Admin email is not configured. Skipping notifications.');
            return self::FAILURE;
        }

        $popularPeople = Person::query()
            ->withCount('likes')
            ->whereNull('liked_threshold_notified_at')
            ->having('likes_count', '>=', $threshold)
            ->get();

        if ($popularPeople->isEmpty()) {
            $this->info('No people crossed the popularity threshold.');
            return self::SUCCESS;
        }

        foreach ($popularPeople as $person) {
            Mail::to($adminEmail)->send(new PopularPersonNotification($person, $person->likes_count));
            $person->update(['liked_threshold_notified_at' => now()]);
        }

        $this->info("Sent notifications for {$popularPeople->count()} popular people to {$adminEmail}.");

        return self::SUCCESS;
    }
}
