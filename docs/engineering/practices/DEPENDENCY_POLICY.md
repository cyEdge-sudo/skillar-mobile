# Dependency Policy

## Purpose

This document defines how third-party dependencies are evaluated, approved, maintained, and removed within the Skillar Mobile application.

---

## Guiding Principles

- Prefer the Expo SDK before third-party libraries.
- Reuse existing dependencies before introducing new ones.
- Minimize dependency count.
- Every dependency must provide clear value.

---

## Dependency Evaluation

Before adding a package, evaluate:

- Active maintenance
- License compatibility
- Community adoption
- Security history
- Bundle size impact
- TypeScript support
- Expo SDK compatibility

---

## Approval Criteria

A new dependency should:

- Solve a real problem.
- Reduce maintenance cost.
- Be actively maintained.
- Be compatible with the project's architecture.
- Have acceptable security posture.

---

## Version Management

- Pin versions where stability is critical.
- Keep dependencies reasonably up to date.
- Avoid unnecessary major upgrades.
- Test upgrades before release.

---

## Security

- Monitor for vulnerabilities.
- Remove abandoned packages.
- Review transitive dependencies.
- Never ignore critical advisories.

---

## Removal Policy

Dependencies should be removed when:

- No longer used.
- Superseded by Expo SDK.
- Security risks outweigh benefits.
- Maintenance has ceased.

---

## Review Checklist

Before merging a new dependency:

- Business justification documented.
- License reviewed.
- Bundle impact assessed.
- Security reviewed.
- Architecture fit confirmed.

---

## Anti-Patterns

Avoid:

- Duplicate libraries with overlapping functionality.
- Unmaintained packages.
- Libraries requiring unnecessary native code.
- Adding dependencies for trivial utilities.

---

## Related Documents

- EXPO_GUIDELINES.md
- SECURITY.md
- PERFORMANCE.md
- BUILD_RELEASE.md