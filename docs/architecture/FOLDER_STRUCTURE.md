# Folder Structure

## Purpose

This document defines the canonical repository structure for the Skillar Mobile application. Every file added to the project should fit into this structure. New top-level directories should only be introduced after architectural review.

## Guiding Principles

- Feature-first organization.
- Clear separation of concerns.
- Shared code lives outside feature modules.
- Business logic is isolated from UI.
- Infrastructure concerns are centralized.

## Proposed Repository Structure

```text
app/                    # Expo Router routes
src/
  assets/               # Images, fonts, icons
  components/           # Shared UI components
  constants/            # App-wide constants
  domain/               # Domain models and interfaces
  features/             # Feature modules
  hooks/                # Shared React hooks
  navigation/           # Navigation helpers
  providers/            # Context providers
  repositories/         # Repository implementations
  services/             # API and platform services
  store/                # Shared state
  theme/                # Design tokens and themes
  types/                # Shared TypeScript types
  utils/                # Utility functions

docs/                   # Project documentation
```

## Feature Module Structure

Each feature should follow a consistent internal layout:

```text
feature-name/
  api/
  components/
  hooks/
  screens/
  services/
  types/
  utils/
```

## Ownership Rules

- Shared UI belongs in `src/components`.
- Feature-specific UI belongs within the feature.
- API access should be encapsulated in repositories and services.
- Screens should contain presentation logic only.
- Business rules should reside outside UI components.

## Import Rules

- Features may depend on shared modules.
- Shared modules must not depend on feature modules.
- Avoid circular dependencies.
- Use path aliases where appropriate.

## Naming Conventions

- Components: PascalCase
- Hooks: `use*`
- Types: PascalCase
- Files: Match exported symbol where practical.
- Constants: UPPER_SNAKE_CASE for values, camelCase for objects.

## Future Evolution

The folder structure may evolve through approved Architecture Decision Records (ADRs). Any structural changes should preserve backward compatibility where possible and minimize disruption to existing modules.