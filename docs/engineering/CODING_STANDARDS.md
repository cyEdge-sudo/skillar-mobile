# Coding Standards

## Purpose

This document defines the coding standards for the Skillar Mobile application. These standards are mandatory for all contributors and AI-assisted code generation.

## Engineering Principles

- Readability over cleverness.
- Maintainability over brevity.
- Reuse before creating new abstractions.
- Composition over inheritance.
- Explicit over implicit behavior.
- Follow Clean Architecture boundaries.

## General Rules

- One responsibility per function.
- One responsibility per component.
- Keep business logic outside UI.
- Prefer immutable data structures.
- Avoid duplicated logic.
- Prefer descriptive names.

## File Size Guidelines

| Artifact | Target | Hard Limit |
|----------|--------|------------|
| Component | <200 LOC | 300 LOC |
| Hook | <150 LOC | 250 LOC |
| Screen | <250 LOC | 350 LOC |
| Service | <200 LOC | 300 LOC |
| Repository | <200 LOC | 300 LOC |

## TypeScript

- Strict mode is required.
- Do not use `any`.
- Do not use `@ts-ignore`.
- Prefer interfaces for contracts.
- Prefer discriminated unions where appropriate.

## React Guidelines

- Functional components only.
- Use hooks.
- Avoid unnecessary memoization.
- Handle loading, error and empty states.

## Imports

- Prefer absolute imports.
- Group imports consistently.
- Do not create circular dependencies.

## Error Handling

- Never swallow exceptions.
- Display user-friendly errors.
- Log unexpected failures.

## Accessibility

- Provide accessibility labels.
- Respect touch target guidelines.
- Support screen readers where applicable.

## Security

- Never hardcode secrets.
- Validate all external input.
- Use secure storage for sensitive data.

## AI Development Rules

- Reuse existing modules before creating new ones.
- Return complete files when modifying code.
- Preserve project architecture.
- Do not invent APIs or folder structures.

## Pull Request Checklist

- TypeScript passes.
- ESLint passes.
- Documentation updated.
- Tests updated where applicable.
- Accessibility reviewed.
- Architecture respected.

## Future Enhancements

This document will continue to evolve with detailed examples, anti-patterns, architectural fitness rules, code review standards, and engineering governance.