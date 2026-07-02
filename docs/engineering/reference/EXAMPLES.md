# Engineering Examples

## Purpose

This document provides practical examples that demonstrate how engineering standards, architectural principles, and coding guidelines should be applied throughout the Skillar Mobile application.

---

## Project Structure

### Good

```
features/
  auth/
    api/
    components/
    hooks/
    screens/
    services/
    types/
```

### Avoid

```
components/
utils/
helpers/
misc/
```

Feature-based organization is preferred over generic folders.

---

## Component Example

Good:

- Small, focused component
- Receives data via props
- Delegates business logic to hooks or services
- Uses shared design system components

Avoid:

- API calls inside components
- Large stateful components
- Mixed presentation and business logic

---

## Custom Hook Example

Good:

- Encapsulates reusable logic
- Returns typed state and actions
- Handles loading and error states

Avoid:

- UI rendering inside hooks
- Feature-specific logic that cannot be reused

---

## Service Layer Example

Good:

- All network requests go through the API layer
- Maps DTOs to domain models
- Handles API errors consistently

Avoid:

- Calling fetch directly from screens
- Returning raw API responses to the UI

---

## State Management Example

Good:

- Keep state local whenever possible
- Share only truly global state
- Derive computed values instead of storing them

Avoid:

- Global state for screen-only concerns
- Duplicated state across components

---

## Testing Example

Good:

- Test behavior, not implementation details
- Keep tests deterministic
- Use builders or factories for test data

Avoid:

- Excessive mocking
- Fragile snapshot tests

---

## Related Documents

- CODING_STANDARDS.md
- CLEAN_ARCHITECTURE.md
- REACT_GUIDELINES.md
- TYPESCRIPT_GUIDELINES.md