# SOLID Principles

## Purpose

This document defines how the SOLID principles are applied throughout the Skillar Mobile application. These principles guide the design of components, hooks, services, repositories, and domain logic to ensure maintainability, scalability, and testability.

---

## S — Single Responsibility Principle

Every module, class, function, hook, and component should have one reason to change.

### Examples

- Components render UI only.
- Hooks encapsulate stateful behavior.
- Repositories coordinate data access.
- Services communicate with external systems.
- Mappers transform DTOs into domain entities.

Avoid combining UI rendering, business logic, and API communication in the same component.

---

## O — Open/Closed Principle

Software entities should be open for extension but closed for modification.

Guidelines:

- Prefer composition over conditional logic.
- Introduce new implementations without modifying stable abstractions.
- Extend behavior through interfaces and reusable modules.

---

## L — Liskov Substitution Principle

Any implementation must be safely substitutable for its abstraction.

Examples:

- Repository implementations must satisfy their interface contracts.
- Mock implementations used in tests must behave consistently with production implementations.

---

## I — Interface Segregation Principle

Prefer small, focused interfaces over large, general-purpose contracts.

Examples:

- Split repository interfaces by capability.
- Keep component props concise and cohesive.
- Avoid 'god interfaces' with unrelated responsibilities.

---

## D — Dependency Inversion Principle

High-level modules should depend on abstractions rather than concrete implementations.

Examples:

- UI depends on repository interfaces.
- Domain logic depends on contracts.
- Infrastructure provides concrete implementations.

---

## Applying SOLID in Skillar

- Use dependency injection where appropriate.
- Keep business rules framework-independent.
- Isolate infrastructure concerns.
- Prefer reusable abstractions only when justified.

---

## Anti-Patterns

Avoid:

- God components
- God services
- Massive hooks
- Large utility classes
- Tight coupling between features
- Excessive inheritance

---

## Enforcement

SOLID compliance should be reinforced through:

- Architecture reviews
- Code reviews
- Automated linting where applicable
- Refactoring before complexity grows

---

## Related Documents

- CODING_STANDARDS.md
- CLEAN_ARCHITECTURE.md
- AI_DEVELOPMENT_GUIDELINES.md