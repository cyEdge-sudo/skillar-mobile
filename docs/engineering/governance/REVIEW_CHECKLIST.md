# Engineering Review Checklist

## Purpose

This checklist provides a consistent framework for reviewing code changes in the Skillar Mobile project. Reviews should focus on correctness, maintainability, security, performance, and architectural alignment.

---

## Architecture

- [ ] Follows Clean Architecture.
- [ ] No cross-feature dependencies.
- [ ] Business logic is outside UI.
- [ ] Repository pattern respected.

---

## Code Quality

- [ ] Naming is clear and consistent.
- [ ] Code is readable.
- [ ] No duplicated logic.
- [ ] SOLID principles applied.
- [ ] Appropriate abstractions used.

---

## TypeScript

- [ ] No `any`.
- [ ] Types are explicit where appropriate.
- [ ] DTOs are separated from domain models.
- [ ] Type assertions are minimized.

---

## React & Expo

- [ ] Components have a single responsibility.
- [ ] Hooks are reusable and focused.
- [ ] FlatList used for large collections.
- [ ] Expo APIs are used appropriately.

---

## Security

- [ ] No hardcoded secrets.
- [ ] Sensitive data is not logged.
- [ ] Input validation is implemented.
- [ ] Secure storage used where required.

---

## Performance

- [ ] No unnecessary re-renders.
- [ ] Expensive work is optimized.
- [ ] Images and assets are optimized.
- [ ] No redundant API calls.

---

## Testing

- [ ] Unit tests added or updated.
- [ ] Integration tests updated where needed.
- [ ] Manual verification completed.
- [ ] CI passes.

---

## Accessibility

- [ ] Accessibility labels present.
- [ ] Screen reader compatibility maintained.
- [ ] Touch targets meet design guidelines.

---

## Documentation

- [ ] Documentation updated.
- [ ] ADR updated if architecture changed.
- [ ] Changelog updated if applicable.

---

## Review Outcome

A review should conclude with one of the following:

- Approve
- Request Changes
- Comment

Changes should not be approved until all required checklist items are satisfied.

---

## Related Documents

- DEFINITION_OF_READY.md
- DEFINITION_OF_DONE.md
- CODING_STANDARDS.md
- CLEAN_ARCHITECTURE.md