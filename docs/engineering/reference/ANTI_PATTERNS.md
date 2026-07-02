# Engineering Anti-Patterns

## Purpose

This document catalogs common anti-patterns that reduce maintainability, scalability, performance, security, and code quality in the Skillar Mobile application. Each anti-pattern includes the preferred alternative.

---

## Architecture

### Avoid

- Feature-to-feature dependencies
- Business logic inside UI components
- Shared 'utils' dumping grounds
- Tight coupling between layers

### Prefer

- Clean Architecture
- Dependency inversion
- Feature isolation
- Well-defined interfaces

---

## React

### Avoid

- Large components with multiple responsibilities
- Deep prop drilling
- Unnecessary useEffect hooks
- Premature memoization

### Prefer

- Small focused components
- Composition
- Custom hooks
- Profile-driven optimization

---

## TypeScript

### Avoid

- any
- Type assertions without validation
- Duplicate type definitions
- Weakly typed APIs

### Prefer

- Strict typing
- Shared models
- DTO mapping
- Type inference where appropriate

---

## API Integration

### Avoid

- fetch inside UI components
- Duplicated API logic
- Ignoring error states
- Returning raw DTOs to the UI

### Prefer

- Repository pattern
- Service layer abstraction
- Centralized error handling
- Domain models

---

## Performance

### Avoid

- Rendering large lists with ScrollView
- Duplicate network requests
- Storing derived state
- Unoptimized assets

### Prefer

- FlatList
- Request deduplication
- Computed values
- Optimized images and assets

---

## Security

### Avoid

- Hardcoded secrets
- Sensitive logs
- AsyncStorage for tokens
- Trusting client-side validation

### Prefer

- SecureStore
- Server-side validation
- Secret management
- Secure logging

---

## Testing

### Avoid

- Testing implementation details
- Excessive mocking
- Fragile snapshot tests
- Untested business logic

### Prefer

- Behavior-driven tests
- Focused mocks
- Reliable assertions
- High-value automated tests

---

## Related Documents

- CODING_STANDARDS.md
- REVIEW_CHECKLIST.md
- REFACTORING_GUIDE.md
- ARCHITECTURAL_FITNESS.md