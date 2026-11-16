# Skillar Mobile

Consumer-facing mobile application for Skillar. The app is built with Expo and React Native. It provides the learner experience; administrative and organization-management modules are outside this app's scope.

## Current status

The foundation is being prepared before the learner APIs are implemented in `skiller-backend`.

Implemented in this branch:
- Expo SDK 54, React Native 0.81, React 19 and strict TypeScript
- Typed React Navigation stack and bottom-tab navigation
- Shared theme provider and reusable UI components
- TanStack Query provider for server state
- Authentication context and SecureStore token storage
- Central API client with request IDs, timeout and cancellation support
- Runtime parsers for API responses
- Login, signup and password-reset screens
- Placeholder dashboard, roadmap exploration, learning and profile screens

The learning screens are intentionally not connected to invented or mock API responses. They will use the backend contract in [API Contract](docs/backend-integration/API_CONTRACT.md) after the endpoints are implemented.

## Requirements

- Node.js version supported by Expo SDK 54
- npm
- Expo Go or an Android/iOS development environment

## Setup

```bash
npm ci

# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to the backend origin. Do not add the `/api/v1` suffix; the API client adds the version prefix.

Examples:
- Android emulator: use the Android emulator host address for your development machine.
- iOS simulator: use the development machine's loopback address.
- Physical device: use the development machine's LAN address, reachable from the phone.

Then start Expo:

```bash
npm start
```

Run a platform-specific command:

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

The project uses strict TypeScript. Explicit `any` types are not allowed. Untrusted API data enters the app as `unknown` and must pass a runtime parser before it is used as a domain type.

## Project structure

```text
src/
  app/
    navigation/       # Root, auth stack and learner tabs
    providers/        # Application-wide providers
  core/
    api/              # HTTP client, error model and response types
    auth/             # Auth service, session and secure token storage
    config/           # Environment-backed configuration
    constants/        # App strings, routes, keys and fixed values
  features/
    auth/             # Login, signup and password reset
    dashboard/
    learning/
    profile/
    roadmaps/
  shared/
    components/       # Reusable UI components
    theme/            # Theme, semantic colors and design tokens
docs/                 # Architecture, API and engineering standards
assets/               # Expo app assets
```

## Engineering rules

1. Screens must not call `fetch` or access backend routes directly. Use a feature service or the shared API client.
2. Do not duplicate API response data in global client state. TanStack Query owns server state; Context owns the small authentication session state.
3. Put API paths, user-visible copy, storage keys, query keys, navigation names and reusable fixed values in `src/core/constants/app.constants.ts`.
4. Do not use explicit `any`. Prefer concrete types. Use `unknown` only at untrusted boundaries and validate it.
5. Store credentials only in platform secure storage. Never store API secrets in the app bundle.
6. Keep feature-specific code within its feature. Shared modules must not depend on feature modules.
7. Add or update documentation when a contract or architecture decision changes.

## Backend integration

The mobile app talks only to the NestJS API in `skiller-backend`. The target API is versioned under `/api/v1`.

The API contract is documented in:
- [API Contract](docs/backend-integration/API_CONTRACT.md)
- [API Architecture](docs/backend-integration/API_ARCHITECTURE.md)
- [Authentication](docs/backend-integration/AUTHENTICATION.md)
- [Error Handling](docs/backend-integration/ERROR_HANDLING.md)

API routes in the mobile constants file describe the agreed target contract. They do not mean the backend endpoints are already available.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/architecture/README.md)
- [Engineering standards](docs/engineering/README.md)
- [Frontend standards](docs/frontend/DESIGN_SYSTEM.md)
- [Contribution guide](docs/CONTRIBUTING.md)

## Branching

Use feature branches and pull requests. Keep `main` as the protected integration branch. Do not push feature work directly to `main`.

Use Conventional Commits, for example:

```text
feat(auth): add learner login
fix(api): handle expired refresh token
docs(api): clarify pagination contract
```
