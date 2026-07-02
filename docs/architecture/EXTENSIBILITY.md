# Extensibility

## Purpose

This document defines how the Skillar Mobile application should evolve while preserving architectural integrity.

## Principles

- Extend existing modules before introducing new ones.
- Favor composition over inheritance.
- Keep features self-contained.
- Preserve backward compatibility where practical.
- Reuse shared components and services.

## Adding New Features

New features should:

1. Follow the established folder structure.
2. Respect module boundaries.
3. Use shared UI components where appropriate.
4. Expose only a minimal public API.
5. Include documentation updates.

## Shared Modules

Promote code to shared modules only when it is reusable across multiple features. Avoid creating shared abstractions prematurely.

## Architectural Changes

Significant structural changes should be documented through an Architecture Decision Record (ADR) before implementation.

## Future Evolution

As the application grows, new capabilities should integrate with the existing architecture rather than bypassing established patterns. Regular architecture reviews should be conducted to ensure consistency and maintainability.