# AI Development Guidelines

## Purpose

This document defines the mandatory rules for AI-assisted development within the Skillar Mobile project. AI-generated contributions must follow the same architectural, engineering, security, and quality standards as human-written code.

---

## Core Principles

- Reuse before creating.
- Respect the documented architecture.
- Never invent APIs, folders, or patterns.
- Produce production-ready code.
- Keep documentation synchronized with implementation.

---

## Before Writing Code

AI must:

1. Search for existing implementations.
2. Reuse existing components, hooks, services, and utilities.
3. Review architecture and engineering documentation.
4. Verify feature boundaries.

---

## Code Generation Rules

- Return complete files when modifying existing code.
- Preserve imports unless intentionally changed.
- Preserve formatting and comments.
- Use strict TypeScript.
- Never use `any`.
- Prefer functional components and hooks.
- Keep business logic outside UI.

---

## Architecture Rules

AI must not:

- Bypass repositories.
- Call APIs directly from screens.
- Introduce cross-feature dependencies.
- Create duplicate abstractions.

Dependencies must always follow the documented Clean Architecture.

---

## Security Requirements

- Never hardcode secrets.
- Validate external input.
- Avoid logging sensitive information.
- Use approved secure storage mechanisms.

---

## Testing Expectations

Generated code should:

- Handle loading states.
- Handle empty states.
- Handle error states.
- Be testable.
- Consider accessibility.

---

## Documentation

Whenever architecture or behavior changes:

- Update the relevant documentation.
- Keep examples synchronized.
- Reference ADRs where applicable.

---

## Definition of Success

AI-generated code should be:

- Readable
- Maintainable
- Secure
- Performant
- Accessible
- Consistent with existing project conventions

---

## Related Documents

- CODING_STANDARDS.md
- CLEAN_ARCHITECTURE.md
- SOLID.md