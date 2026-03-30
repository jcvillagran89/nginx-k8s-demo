<!-- Guidance for AI coding agents working on this repository -->

# Copilot / AI Agent Instructions

This file contains concise, actionable information for AI agents editing this repository. Focus on discoverable patterns, commands and integration points so you can be productive immediately.

- Repository type: Laravel + Inertia (React) app. Back-end PHP (Laravel-style) lives under `app/`, front-end React + Vite under `resources/js/`.
- Key directories:
    - `app/Models`, `app/Http/Controllers` — domain models and controllers. Follow existing PSR-12-like style.
    - `app/Services` — application service classes (e.g. `app/Services/DbSync` for sync logic).
    - `app/Providers` — service provider registrations.
    - `resources/js/components` — React components. Example: `resources/js/components/_test/TestRequestTable.tsx` (uses Inertia, React-Bootstrap, and Ziggy `route()` helpers).
    - `routes/` — route definitions split by area (e.g., `web.php`, `auth.php`, `admin/` subfolders).
    - `database/migrations`, `database/seeders` — DB schema and seeding. There is an `oracle-docker/` folder with a Docker Compose setup for Oracle if present in local dev.

Quick architecture summary

- Laravel controllers return Inertia responses that render React pages. React components use `@inertiajs/react` and the Ziggy `route()` helper (client-side `route('name', id)`) to call backend routes.
- Data flows: server-side controllers prepare props for Inertia pages (models, paginated results) -> React components receive those props (e.g. `test_requests`, `analysts`) -> UI triggers `router.post(...)` or `Link` to call server endpoints.

Developer workflows (commands)

- PHP dependencies: `composer install`
- Node dependencies / frontend: `npm install` (or `pnpm install` / `yarn install` depending on contributor preference)
- Frontend dev (Vite + Inertia): `npm run dev` (starts Vite hot reload). Build for production: `npm run build`.
- Laravel dev/dev server: `php artisan serve` (or use your preferred local server setup). Run database migrations: `php artisan migrate` and seeders with `php artisan db:seed`.
- Tests: repository includes Pest tests (`tests/` + `Pest.php`). Run tests with `./vendor/bin/pest` or `php artisan test`.
- Docker: `oracle-docker/docker-compose.yml` can be used to run an Oracle DB for local testing — inspect that folder before attempting database connections.

Project-specific conventions and patterns

- Language: UI labels and many identifiers use Spanish. Keep translations/context in mind when editing UI text.
- React components receive server props with names like `test_requests` (paginated object with `.data`) — expect `test_requests.data` to be an array of items and follow that structure.
- When calling routes from the client, use Ziggy `route()` and Inertia `router.post(...)` patterns. Example from `TestRequestTable.tsx`:

```ts
// send request example
router.post(
    route('test.request.send', selectedRequest.id),
    { assignated_to: assignatedTo },
    { onFinish: () => setShowModal(false), preserveScroll: true },
);
```

- UI uses React-Bootstrap components (e.g., `Modal`, `Button`, `Collapse`) and an internal wrapper `IconifyIcon` (see `resources/js/components/wrappers/IconifyIcon`). Reuse these patterns for consistent UI.
- Avatars and small UI bits often use inline styles in components; prefer minimal, consistent changes rather than wholesale style rewrites.
- Server-side naming: controllers and routes often use Spanish-style route names such as `test.request.send`, `test.request.cancel` — match these when adding new endpoints.

Integration points and external dependencies

- Ziggy (client-side `route()` helper) — ensure route names used in JS exist in `routes/`.
- Inertia (`@inertiajs/react`) — server must return Inertia responses for client pages.
- Oracle integration: there is an `oracle-docker` folder. If modifying DB migrations or seeds that are Oracle-specific, validate against that environment.
- Frontend libraries: Vite, React, React-Bootstrap, Iconify. Check `package.json` for exact versions if adding new JS dependencies.

Editing guidance (do this, not generic advice)

- When changing an API route, update `routes/` and corresponding controller in `app/Http/Controllers`, then update any client-side `route()` calls (Ziggy) to match. Run `php artisan route:list` locally if unsure.
- When changing props returned to a page, update the Inertia controller and then the associated React component's prop usage. Look for `.data` when handling paginated resources.
- Prefer small, focused changes. Many components rely on specific prop shapes (e.g., `item.test?.[0]?.results?.[0]?.content`) — avoid refactors that change nested data shapes without coordinated server and client updates.

Files to inspect first when onboarding

- `routes/web.php` and other files in `routes/` to understand available endpoints and route names.
- `app/Http/Controllers` to learn controller responsibilities.
- `app/Services` (e.g., `DbSync`) for domain logic separated from controllers.
- `resources/js/pages` and `resources/js/components` to see React + Inertia patterns; example UI: `resources/js/components/_test/TestRequestTable.tsx`.
- `phpunit.xml` and `Pest.php` to understand test config and how tests are run.

If you make edits, ask the human for:

- Which environment to run against (local MySQL, Oracle docker, or staging).
- Whether frontend changes require a full Vite build (`npm run build`) or just `npm run dev` live reload.

If any section above is unclear or you want deeper examples (e.g., show the exact controller and its returned Inertia props for a given page), ask and I will extract the relevant files and merge into this guidance.
