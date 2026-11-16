# Coding Standards

These standards apply to all production code in Skillar Mobile.

## Engineering principles

- Readability over cleverness.
- Maintainability over brevity.
- Reuse existing modules before creating abstractions.
- Composition over inheritance.
- Explicit behavior over implicit behavior.
- Keep feature and infrastructure boundaries clear.

## TypeScript

- Strict mode is required.
- Explicit `any` is prohibited and fails ESLint.
- Use concrete types for app-owned data.
- Use `unknown` only at external or untrusted boundaries.
- Validate untrusted values with runtime parsers before using them as domain types.
- Avoid unsafe type assertions and `@ts-ignore`.
- Use type-only imports when importing only a type.
- Do not suppress type errors to make a build pass.

## Constants and strings

- Centralize API paths in `API_ROUTES`.
- Centralize user-facing copy in `UI_COPY` or `APP_MESSAGES`.
- Centralize storage keys, request headers, query keys, navigation names, HTTP methods and stable error codes.
- Keep design values in the theme token system.
- Avoid repeating hard-coded strings across screens and services.

## Architecture

- Screens must not call `fetch`.
- API requests must go through feature services and the shared API client.
- TanStack Query owns server state.
- Auth Context owns session state only.
- SecureStore owns sensitive session tokens.
- Shared modules must not import feature internals.

## React Native

- Use functional components and hooks.
- Handle loading, error and empty states.
- Provide accessibility labels and states.
- Avoid unnecessary global state and memoization.

## Quality

Before a change is merged:
- TypeScript passes.
- ESLint passes.
- Formatting passes.
- Documentation is updated.
- Relevant tests are added or updated.
- No secrets or private credentials are committed.
