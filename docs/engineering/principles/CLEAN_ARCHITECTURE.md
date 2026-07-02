# Clean Architecture

## Purpose

This document defines the Clean Architecture principles adopted by the Skillar Mobile application. It establishes the dependency rules, layer responsibilities, and implementation guidelines to ensure a scalable, maintainable, and testable codebase.

## Core Principles

- Business rules are independent of frameworks.
- UI depends on domain abstractions, never the reverse.
- Dependencies point inward.
- Infrastructure details are replaceable.
- Features are isolated.

## Architectural Layers

### Presentation
- Expo Router screens
- React components
- Custom hooks
- View models

Responsible for rendering UI and user interaction only.

### Domain
- Entities
- Use cases
- Repository interfaces
- Business rules

Contains no React, Expo, or React Native dependencies.

### Data
- DTOs
- Mappers
- Repository implementations
- API services

Responsible for translating external data into domain entities.

### Infrastructure
- REST client
- Secure Store
- Notifications
- Device APIs
- Storage

Provides concrete implementations for external services.

## Dependency Rule

Presentation → Domain → Data → Infrastructure

No layer may depend on an outer layer.

## Feature Isolation

Each feature owns:
- Screens
- Components
- Hooks
- Repository implementation
- Models

Features communicate only through shared abstractions.

## Shared Module

Shared code should contain only reusable utilities, UI primitives, hooks, and domain-independent helpers.

## Anti-Patterns

Avoid:
- Business logic inside UI components.
- Direct API calls from screens.
- Cross-feature imports.
- Framework dependencies inside the domain layer.

## Enforcement

Architecture rules should be enforced using lint rules, code review, and architectural fitness tests.

## Related Documents

- CODING_STANDARDS.md
- SOLID.md
- AI_DEVELOPMENT_GUIDELINES.md