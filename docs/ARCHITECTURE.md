# Skillar Mobile Architecture

## Scope

The mobile app is the consumer-facing learner application. It does not contain admin or organization-management screens.

## Technology

- Expo SDK 58
- React Native 0.88.1
- React 19.3
- TypeScript 6 with strict compiler options
- React Navigation 7 for typed native-stack and bottom-tab navigation
- TanStack Query for server state and request caching
- React Context for the small authentication session state
- Expo SecureStore for access and refresh tokens
- Shared design tokens and theme provider

We use React Navigation because it is already installed and used by the app. Expo Router is not part of the current routing implementation.

## Architecture rules

- Feature-first modules own their screens, feature-specific code and feature-owned route parameter contracts.
- React Navigation route maps and navigator configuration belong in `src/app/navigation`.
- App-level route components adapt navigator props to typed feature screen props. Feature screens do not import app navigation types or React Navigation hooks.
- Shared code is feature-agnostic.
- Screens call feature services or hooks. They do not issue HTTP requests directly.
- The shared API client owns transport concerns.
- Runtime parsers validate API payloads before the app treats them as typed data.
- TanStack Query owns API/server state.
- Auth Context owns only session status and current learner identity.
- SecureStore owns sensitive session tokens.
- Constants are centralized in `src/core/constants/app.constants.ts`.
- Dependencies must not flow from shared/core modules into feature modules.

## Runtime request flow

```text
Screen
  -> Feature service / query hook
  -> Shared API client
  -> /api/v1 NestJS API in skiller-backend
  -> Backend services
  -> PostgreSQL
```

Responses pass through a runtime parser before being exposed to the feature.

## Main source structure

```text
src/
  app/
    navigation/
    providers/
  core/
    api/
    auth/
    config/
    constants/
  features/
    auth/
    dashboard/
    learning/
    profile/
    roadmaps/
  shared/
    components/
    theme/
```

## Offline approach

The initial foundation does not implement offline content downloads or a progress-sync queue. Those features require explicit conflict and retry contracts in the backend. Do not imply that offline learning is supported until that work is implemented and tested.

## Quality controls

- Strict TypeScript; no explicit `any`.
- Use `unknown` at external boundaries and parse it.
- Use shared constants for reusable text, endpoint paths, storage keys and query keys.
- Keep secrets out of the app bundle.
- Run typecheck, lint and formatting checks before merging.
