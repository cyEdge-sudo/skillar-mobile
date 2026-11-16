# Skillar Mobile

Consumer-facing mobile application for Skillar. The app provides the learner experience for discovering and following learning roadmaps. Administrative and organisation-management modules are outside this application's scope.

## Technology

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript with strict compiler settings
- React Navigation 7
- React Native Safe Area Context

The app will integrate with the NestJS API in `skiller-backend`. Backend endpoints will be implemented separately.

## Requirements

- Node.js compatible with Expo SDK 54
- npm
- Expo Go or an Android/iOS development environment

## Getting started

Install dependencies:

```bash
npm ci
```

Create a local environment file:

**macOS / Linux**

```bash
cp .env.example .env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

Set `EXPO_PUBLIC_API_BASE_URL` to the backend origin when API integration is enabled. Do not add the `/api/v1` suffix; the mobile API client adds the version prefix.

For local development, use a host address that is reachable from the selected emulator or physical device. Do not use `localhost` from a physical device to refer to the development machine.

Start Expo:

```bash
npm start
```

Platform commands:

```bash
npm run android
npm run ios
npm run web
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run format:check
```

The project uses strict TypeScript. Do not introduce explicit `any`. Treat untrusted input as `unknown` and validate it before use.

## Repository structure

```text
App.tsx
index.ts
src/
  app/           # App providers and navigation
  core/          # Shared infrastructure and app-wide configuration
  features/      # Learner-facing feature modules
  shared/        # Reusable UI, theme and common utilities
docs/            # Architecture and engineering documentation
assets/          # Expo application assets
```

## Engineering conventions

1. Keep API paths, storage keys, query keys, navigation names and reusable UI copy in the central constants module.
2. Screens must not issue HTTP requests directly. Use feature services and the shared API client.
3. Keep server state separate from client UI state.
4. Store credentials in platform secure storage. Never bundle database credentials, private API keys or server secrets in the app.
5. Keep feature-specific code inside its feature. Shared modules must not depend on feature internals.
6. Update the relevant documentation when an API contract or architecture decision changes.
7. Work on feature branches and merge through pull requests. Do not push feature work directly to `main`.

## Backend integration

The mobile app communicates with the NestJS API in `skiller-backend`. The target mobile API is versioned under `/api/v1`.

API endpoint definitions in the mobile app represent the agreed target contract. They do not indicate that backend endpoints are already available. The mobile app must not call Next.js server actions or access the database directly.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Architecture decisions](docs/architecture/README.md)
- [API architecture](docs/backend-integration/API_ARCHITECTURE.md)
- [Authentication](docs/backend-integration/AUTHENTICATION.md)
- [Error handling](docs/backend-integration/ERROR_HANDLING.md)
- [Engineering standards](docs/engineering/README.md)
- [Contribution guide](docs/CONTRIBUTING.md)

## Commits

Use Conventional Commits:

```text
feat(auth): add learner login
fix(api): handle expired access token
docs(api): clarify pagination contract
refactor(navigation): simplify learner tabs
```
