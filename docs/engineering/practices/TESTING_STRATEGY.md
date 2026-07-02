# Testing Strategy

## Purpose

This document defines the testing strategy for the Skillar Mobile application. The objective is to ensure confidence in code quality through automated testing at multiple levels while keeping tests maintainable and fast.

---

## Testing Pyramid

1. Unit Tests
2. Component Tests
3. Integration Tests
4. End-to-End Tests

Favor a broad base of unit tests with a smaller number of end-to-end tests.

---

## Unit Testing

Test:
- Domain logic
- Utility functions
- Mappers
- Validation
- Custom hooks

Requirements:
- Fast
- Deterministic
- Independent

---

## Component Testing

Verify:
- Rendering
- User interactions
- Accessibility
- Conditional UI states

Mock external dependencies where appropriate.

---

## Integration Testing

Test interactions between:
- Screens
- Navigation
- API layer
- State management
- Repositories

Focus on realistic application flows.

---

## End-to-End Testing

Validate critical user journeys such as:
- Authentication
- Course browsing
- Learning flow
- Profile management

Keep E2E tests focused on high-value scenarios.

---

## Test Coverage Goals

- Domain: 90%+
- Services: 80%+
- Shared utilities: 90%+
- Critical features: High confidence over raw percentage

Coverage metrics should guide quality, not replace thoughtful testing.

---

## Test Data

- Use factories and builders.
- Avoid shared mutable fixtures.
- Keep test data minimal and readable.

---

## CI Requirements

Every pull request should:
- Run automated tests.
- Pass linting.
- Pass type checking.
- Block merges on failures.

---

## Anti-Patterns

Avoid:
- Brittle snapshot tests
- Testing implementation details
- Excessive mocking
- Flaky asynchronous tests

---

## Related Documents

- TYPESCRIPT_GUIDELINES.md
- REACT_GUIDELINES.md
- BUILD_RELEASE.md
- DEFINITION_OF_DONE.md