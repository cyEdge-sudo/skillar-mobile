# Module Boundaries

## Purpose

This document defines the architectural boundaries between modules in the Skillar Mobile application. Clear ownership and dependency rules help maintain a scalable, maintainable, and testable codebase.

## Architectural Layers

The application follows a layered Clean Architecture approach:

1. Presentation Layer
2. Application Layer
3. Domain Layer
4. Data Layer
5. Infrastructure Layer

Dependencies must always flow inward toward the Domain Layer.

## Feature Modules

Each feature module encapsulates a cohesive business capability, such as:

- Authentication
- Dashboard
- Courses
- Journeys
- Lesson Player
- Assessments
- Notifications
- Profile
- Downloads
- Settings

Feature modules should own:

- Screens
- Feature-specific components
- Hooks
- Services
- Types
- Utilities

## Shared Modules

The following modules are shared across features:

- Components
- Theme
- Constants
- Domain
- Repositories
- Services
- Utilities
- Types

Shared modules must remain feature-agnostic.

## Public vs. Internal APIs

Each feature should expose a minimal public API. Internal implementation details must remain private to the feature module.

Examples of public exports include:

- Screens registered with Expo Router
- Reusable feature components
- Public hooks
- Repository interfaces

Implementation details such as helper functions and internal utilities should not be imported directly by other features.

## Cross-Cutting Concerns

The following concerns are shared across the application and should be centralized:

- Authentication
- Networking
- Analytics
- Logging
- Error handling
- Offline synchronization
- Secure storage
- Feature flags

## Dependency Rules

- Features may depend on shared modules.
- Features must not depend directly on other feature internals.
- Shared modules must not depend on feature modules.
- Domain models must not depend on UI frameworks.
- Infrastructure code should be isolated behind interfaces where appropriate.

## Extension Guidelines

New features should be introduced as self-contained modules that adhere to these boundaries. If a feature requires changes to shared modules or introduces new architectural patterns, an Architecture Decision Record (ADR) should be created before implementation.
