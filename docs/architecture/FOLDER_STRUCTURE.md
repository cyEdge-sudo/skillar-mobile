# Folder Structure

## Purpose

This document describes the folder structure that exists in the Skillar Mobile application. Add files to the owning feature or shared module. Do not create new root-level folders without an architecture decision.

## Repository structure

```text
App.tsx
index.ts
assets/
docs/
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
      screens/
    dashboard/
      screens/
    learning/
      screens/
    profile/
      screens/
    roadmaps/
      screens/
  shared/
    components/
      primitives/
      themed/
    theme/
      context/
      hooks/
      providers/
      themes/
      tokens/
      types/
```

## Ownership

### `src/app`

Application bootstrap concerns that compose the application:

- Navigation containers and typed route parameter lists.
- Application-wide providers.

### `src/core`

Cross-feature infrastructure and stable app contracts:

- `api`: HTTP transport, typed request options, response envelopes and normalized errors.
- `auth`: authentication services, session state, token persistence and runtime parsers.
- `config`: environment-backed public configuration.
- `constants`: API routes, navigation names, copy, storage keys, query keys, headers, status values and stable error codes.

### `src/features`

Feature-owned screens, components, services, hooks, types and validation. A feature should only add subfolders when it needs them. Do not create empty folders to match a template.

### `src/shared`

Reusable UI components and design-system code. Shared code must not depend on feature modules.

## Feature module conventions

Use this structure when a feature grows:

```text
feature-name/
  components/
  hooks/
  screens/
  services/
  types/
  utils/
```

API calls remain behind feature services and the shared API client. Screens must not call `fetch` or build endpoint URLs.

## Import rules

- Features may depend on `core` and `shared`.
- Core and shared modules must not import feature implementation details.
- Features must not import another feature's internal files.
- Avoid circular dependencies.
- Prefer type-only imports when importing only TypeScript types.

## Naming conventions

- Components and types: PascalCase.
- Hooks: `use*`.
- Files and folders: kebab-case.
- Exported constants: UPPER_SNAKE_CASE keys inside named constant groups.
- Functions and variables: camelCase.

The structure may evolve through Architecture Decision Records. Update this document when the actual structure changes.
