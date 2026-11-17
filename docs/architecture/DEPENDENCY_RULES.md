# Dependency Rules

This document defines dependency rules for the Skillar Mobile feature-first architecture.

## Core Rule

Keep application composition at the app boundary. Feature modules own their screens, feature logic, data contracts and feature-specific types. Shared and core modules must remain feature-agnostic.

## Allowed Dependencies

- App composition may import feature public APIs and connect feature screens to navigation.
- Features may import their own feature modules, shared modules and core services.
- Features must not import app implementation details, including navigation types or navigator instances.
- Features must not import internal code from another feature.
- Shared modules must not import app or feature implementation code.
- Core modules must not import app or feature implementation code.

## Navigation Ownership

- React Navigation route maps and navigator configuration belong in `src/app/navigation`.
- Route parameter contracts that describe feature data belong to the owning feature.
- App-level route components adapt React Navigation props to feature screen props.
- Feature screens receive route data and navigation actions through typed props.
- Feature screens must not call React Navigation hooks or import app navigation types.

## General Rules

- Avoid circular dependencies.
- Keep business rules in feature services and hooks, not navigator components.
- Do not add abstraction layers unless they solve a demonstrated problem.
- Prefer explicit feature contracts over importing implementation details.
- Significant dependency changes require an ADR.
