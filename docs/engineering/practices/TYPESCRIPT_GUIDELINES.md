# TypeScript Guidelines

## Purpose

This document defines the TypeScript standards for the Skillar Mobile application. Strict typing is mandatory to improve maintainability, reliability, and developer experience.

---

## Compiler Configuration

- Enable `strict` mode.
- Enable `noUncheckedIndexedAccess`.
- Enable `noImplicitOverride`.
- Treat compiler warnings as issues to resolve.

---

## General Rules

- Never use `any`.
- Avoid `@ts-ignore`.
- Prefer explicit types for public APIs.
- Use type inference for local variables where it improves readability.

---

## Interfaces vs Types

Use interfaces for:
- Object contracts
- Public APIs
- Repository contracts

Use type aliases for:
- Unions
- Utility types
- Function signatures
- Mapped types

---

## Null Safety

- Prefer `undefined` over `null` unless required by an external API.
- Handle optional values explicitly.
- Use optional chaining and nullish coalescing where appropriate.

---

## Generics

- Use meaningful generic parameter names.
- Constrain generics where possible.
- Avoid unnecessary complexity.

---

## Enums

- Prefer string literal unions over enums unless interoperability requires enums.

---

## Error Handling

- Type errors explicitly.
- Avoid throwing raw strings.
- Use custom error types where appropriate.

---

## DTOs and Domain Models

- Keep API DTOs separate from domain entities.
- Map DTOs into domain models through dedicated mappers.
- Do not expose DTOs directly to the UI.

---

## Imports and Exports

- Prefer named exports.
- Avoid default exports unless required by framework conventions.
- Group type-only imports using `import type`.

---

## Anti-Patterns

Avoid:

- `any`
- `@ts-ignore`
- Overuse of type assertions
- Large, deeply nested types
- Mixing DTOs with domain entities

---

## Related Documents

- CODING_STANDARDS.md
- CLEAN_ARCHITECTURE.md
- AI_DEVELOPMENT_GUIDELINES.md