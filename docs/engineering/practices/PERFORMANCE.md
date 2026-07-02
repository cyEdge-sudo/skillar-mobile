# Performance Guidelines

## Purpose

This document defines the performance engineering practices for the Skillar Mobile application. Performance should be considered throughout design, implementation, and testing to deliver a responsive user experience.

---

## Performance Principles

- Measure before optimizing.
- Optimize the user experience, not micro-benchmarks.
- Avoid unnecessary work.
- Prefer simple solutions.

---

## Performance Budgets

- Cold start target: < 2.5 seconds on a mid-range Android device.
- Screen transitions: < 300 ms.
- Maintain 60 FPS during common interactions.
- Minimize JavaScript thread blocking.

---

## Rendering

- Use FlatList for long lists.
- Avoid unnecessary re-renders.
- Memoize only after profiling.
- Keep component trees shallow.

---

## State Management

- Keep state as local as possible.
- Avoid duplicated state.
- Compute derived values instead of storing them.

---

## Networking

- Batch requests where appropriate.
- Avoid redundant API calls.
- Implement request cancellation for abandoned screens.
- Respect backend pagination.

---

## Assets

- Optimize images.
- Lazy-load large assets.
- Minimize bundled resources.
- Prefer vector assets where appropriate.

---

## Memory

- Release unused references.
- Avoid large in-memory collections.
- Dispose subscriptions and listeners.

---

## Profiling

Regularly monitor:

- Startup time
- Render performance
- Memory usage
- Network latency
- Bundle size

---

## Anti-Patterns

Avoid:

- Premature optimization
- Excessive memoization
- Massive component trees
- Unbounded list rendering
- Duplicate network requests

---

## Related Documents

- REACT_GUIDELINES.md
- EXPO_GUIDELINES.md
- BUILD_RELEASE.md
- CODING_STANDARDS.md