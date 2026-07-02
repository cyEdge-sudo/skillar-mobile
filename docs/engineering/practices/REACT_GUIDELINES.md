# React Guidelines

## Purpose

This document defines the React and React Native development standards for the Skillar Mobile application. It ensures consistency, maintainability, performance, and accessibility across the UI layer.

---

## Core Principles

- Use functional components only.
- Prefer composition over inheritance.
- Keep components small and focused.
- Separate presentation from business logic.
- Reuse existing components before creating new ones.

---

## Component Design

- One component should have one responsibility.
- Extract reusable UI into shared components.
- Keep screens responsible for orchestration, not business logic.
- Avoid deeply nested component trees.

---

## Hooks

- Use React Hooks for state and lifecycle management.
- Extract reusable logic into custom hooks.
- Do not call hooks conditionally.
- Keep hooks focused on a single concern.

---

## State Management

- Prefer local state when possible.
- Use Context only for shared application state.
- Avoid unnecessary global state.
- Keep derived state out of React state when it can be computed.

---

## Rendering Performance

- Minimize unnecessary re-renders.
- Use `React.memo` only when profiling justifies it.
- Memoize expensive computations with `useMemo`.
- Memoize callbacks with `useCallback` only when beneficial.
- Use `FlatList` for large collections.

---

## Side Effects

- Keep `useEffect` focused and deterministic.
- Include all required dependencies.
- Avoid performing business logic directly inside effects.

---

## Accessibility

- Provide accessibility labels.
- Support screen readers.
- Ensure adequate touch target sizes.
- Respect system font scaling where appropriate.

---

## Anti-Patterns

Avoid:

- Massive components
- Prop drilling across many levels
- Business logic inside UI
- Direct API calls from components
- Unnecessary memoization

---

## Related Documents

- CODING_STANDARDS.md
- CLEAN_ARCHITECTURE.md
- TYPESCRIPT_GUIDELINES.md
- DESIGN_SYSTEM.md