<p align="center"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="320" alt="Laravel Logo"></p>

# TinderClone Backend

Laravel 10 backend that powers the TinderClone mobile client. It exposes APIs for discovering people, submitting like/dislike feedback, retrieving liked matches, and emailing admins when somebody becomes popular.

## Features

- People catalogue with pagination (`/api/people`)
- Like/dislike feedback routes with user-level deduplication
- Ranked list of liked people (`/api/people/liked`)
- Hourly cron job (`app:notify-popular-people`) that emails the admin whenever somebody crosses the configurable like threshold (defaults to 50)
- REST API documented via Swagger UI at `/docs`

## Getting Started

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Refresh people data

The `PersonSeeder` now loads profiles from `example-people.json`. Whenever you update that file, run:

```bash
php artisan migrate:fresh --seed
```

This wipes existing people/feedback rows and repopulates the database with the new JSON dataset.

### Environment flags

| Variable | Purpose | Default |
|----------|---------|---------|
| `PEOPLE_POPULAR_LIKE_THRESHOLD` | Likes required before notifying the admin | `50` |
| `PEOPLE_ADMIN_EMAIL` | Destination email for popularity alerts | `MAIL_FROM_ADDRESS` fallback |

Configure mail transport (`MAIL_MAILER`, `MAIL_HOST`, etc.) so the cron job can send out notifications.

## API Reference

- Swagger UI: `GET /docs`
- Raw OpenAPI: `GET /openapi.yaml`

All endpoints support JSON and live under the `/api` prefix.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/people` | Paginated recommendations |
| `POST` | `/api/people/{person}/like` | Record/update a like |
| `POST` | `/api/people/{person}/dislike` | Record/update a dislike |
| `GET` | `/api/people/liked` | Returns people with ≥ 1 like ordered by popularity |

`user_identifier` in request payloads should be a stable identifier for the acting user (e.g. device id).

## Cron & Queues

The hourly scheduler runs `php artisan app:notify-popular-people`. Configure your system cron or Supervisor to execute `php artisan schedule:run` every minute.

## Tests

```bash
php artisan test
```

The suite covers listing, liking, and dislike switching flows.
