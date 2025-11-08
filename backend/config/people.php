<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Popular Like Threshold
    |--------------------------------------------------------------------------
    |
    | Once a person reaches this number of likes we will trigger the notification
    | email to the admin. You can override this value via the
    | PEOPLE_POPULAR_LIKE_THRESHOLD environment variable.
    |
    */
    'popular_like_threshold' => (int) env('PEOPLE_POPULAR_LIKE_THRESHOLD', 50),

    /*
    |--------------------------------------------------------------------------
    | Admin email
    |--------------------------------------------------------------------------
    |
    | Set the address that should receive popularity alerts. Falls back to the
    | default mail sender if you do not specify a dedicated email.
    |
    */
    'admin_email' => env('PEOPLE_ADMIN_EMAIL', env('MAIL_FROM_ADDRESS', 'admin@example.com')),
];

