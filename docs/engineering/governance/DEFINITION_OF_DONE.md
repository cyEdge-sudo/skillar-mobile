# Definition of Done (DoD)

## Purpose

The Definition of Done establishes the minimum quality bar that every work item must satisfy before it can be considered complete and eligible for release.

---

## Implementation

The implementation must:

- Fully satisfy the acceptance criteria.
- Follow the documented architecture.
- Adhere to coding standards.
- Reuse existing components where appropriate.
- Avoid known anti-patterns.

---

## Code Quality

The code must:

- Pass TypeScript compilation.
- Pass ESLint.
- Avoid compiler warnings.
- Be reviewed by at least one engineer.
- Include meaningful comments only where necessary.

---

## Testing

The implementation must include:

- Unit tests where applicable.
- Updated integration tests when required.
- Successful manual verification.
- No failing automated tests.

---

## Security

Verify:

- No hardcoded secrets.
- Input validation implemented.
- Secure storage used where required.
- No sensitive logging.

---

## Performance

Verify:

- No unnecessary re-renders.
- Lists use FlatList where appropriate.
- No obvious performance regressions.

---

## Documentation

Before completion:

- Documentation updated.
- Architecture documentation updated if impacted.
- ADRs created where necessary.

---

## Accessibility

Verify:

- Accessibility labels added.
- Screen reader support maintained.
- Touch targets meet design guidelines.

---

## Release Readiness

The work item:

- Builds successfully.
- Passes CI.
- Meets release checklist requirements.
- Is ready for deployment without additional engineering work.

---

## Checklist

- [ ] Acceptance criteria complete
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Security verified
- [ ] Performance verified
- [ ] Accessibility verified
- [ ] CI passing

---

## Related Documents

- DEFINITION_OF_READY.md
- REVIEW_CHECKLIST.md
- TESTING_STRATEGY.md
- BUILD_RELEASE.md