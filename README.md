## TinderClone Mobile

React Native 0.82 client that talks to the Laravel backend in `backend/`. The app uses React Query, Zustand, and vector icons to render a Tinder-style swipe deck, persist likes/dislikes, and show matches pulled from the API.

### Prerequisites
- Node 20+
- React Native CLI environment (Android Studio / Xcode)
- Backend running: see `backend/README.md`

### Install & Run
```sh
npm install
npm start        # starts Metro
npm run ios      # or: npm run android
```
If you add native dependencies (e.g. async-storage) run `cd ios && pod install`.

### API Configuration
The app calls the Laravel API via the base URL defined in `src/config/api.ts`. Defaults:
- iOS simulator: `http://127.0.0.1:8000`
- Android emulator: `http://10.0.2.2:8000`
- Production: `https://tinder-app-api.vercel.app/api`

For physical devices, change `API_BASE_URL` to your machine's LAN IP (e.g. `http://192.168.0.42:8000`). You can also inject `API_BASE_URL` at build time if you wrap the Metro bundler with environment variables or use the production endpoint above.

### Data Flow
- `usePeople` loads paginated recommendations from `/api/people` and hydrates the swipe deck store.
- `useFeedbackMutation` posts likes/dislikes with a persisted `user_identifier` from `AsyncStorage`.
- `useLikedPeople` drives the Matches screen from `/api/people/liked`.
- `useFeedbackSummary` fetches `/api/people/summary` so the dashboard counters stay in sync with the server (likes, passes, remaining profiles).

### Backend Deployment (Vercel)
1. `cd backend`
2. Ensure `vercel.json` is committed (contains PHP runtime, rewrites, and `/openapi.yaml` passthrough).
3. Create environment variables in Vercel (Production & Preview):
   - `APP_URL` = `https://tinder-app-api.vercel.app`
   - `APP_KEY` = Laravel app key (`php artisan key:generate --show`)
   - Database credentials (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)
4. Deploy: `vercel --prod` (or push to the connected repo).
5. After the first deploy, run seeds once if necessary: `vercel env pull` + remote CLI, or trigger via local artisan hitting the production DB.

Deployed endpoints:
- Swagger UI: `https://tinder-app-api.vercel.app/docs`
- OpenAPI spec: `https://tinder-app-api.vercel.app/openapi.yaml`
- API base URL: `https://tinder-app-api.vercel.app/api`

### Testing & Linting
```sh
php artisan test          # from backend/ for API feature tests
npm run lint              # React Native linting
```

### Useful Scripts
- `npm run ios` / `npm run android`: builds mobile app
- `npm run start`: Metro bundler
- `php artisan schedule:work` (backend) to process hourly popularity emails

See `backend/README.md` for database seeding, Swagger docs, and cron setup.
