# Refactoring Guide

## Purpose

This guide defines how code should be safely refactored within the Skillar Mobile project while preserving behavior, improving maintainability, and reducing technical debt.

---

## Core Principles

- Preserve external behavior.
- Refactor incrementally.
- Keep changes small and reviewable.
- Validate every refactoring with tests.
- Prefer continuous improvement over large rewrites.

---

## When to Refactor

Consider refactoring when you encounter:

- Duplicate code
- Large components or functions
- Long parameter lists
- Tight coupling
- Low cohesion
- Complex conditional logic
- Frequent defects
- Performance bottlenecks

---

## Refactoring Workflow

1. Understand the existing behavior.
2. Add or update automated tests.
3. Refactor in small, isolated steps.
4. Verify behavior after each step.
5. Remove obsolete code.
6. Update documentation if required.

---

## Recommended Techniques

- Extract Component
- Extract Hook
- Extract Service
- Extract Interface
- Replace Conditionals with Polymorphism
- Introduce Value Objects
- Simplify State Management
- Remove Dead Code

---

## Validation Checklist

- TypeScript compilation passes.
- Tests pass.
- No behavioral regressions.
- Performance is maintained or improved.
- Security is unaffected.
- Documentation remains accurate.

---

## Anti-Patterns

Avoid:

- Large-scale rewrites without business value.
- Mixing refactoring with unrelated feature work.
- Refactoring without tests.
- Introducing new abstractions prematurely.

---

## Related Documents

- TECHNICAL_DEBT.md
- REVIEW_CHECKLIST.md
- CLEAN_ARCHITECTURE.md
- ARCHITECTURAL_FITNESS.md