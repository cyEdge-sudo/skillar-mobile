# Technical Debt

## Purpose

This document defines how technical debt is identified, documented, prioritized, and addressed throughout the Skillar Mobile project. Technical debt should be managed deliberately rather than allowed to accumulate unnoticed.

---

## Guiding Principles

- Make technical debt visible.
- Prefer prevention over remediation.
- Record intentional trade-offs.
- Continuously reduce debt.
- Never hide known issues.

---

## Categories

Technical debt may include:

- Architecture debt
- Code debt
- Test debt
- Documentation debt
- Security debt
- Performance debt
- Dependency debt
- UX debt

---

## Identification

Technical debt should be identified through:

- Code reviews
- Architecture reviews
- Static analysis
- Security reviews
- Performance profiling
- Retrospectives
- User feedback

---

## Recording Debt

Each debt item should include:

- Description
- Impact
- Root cause
- Risk level
- Estimated effort
- Owner
- Target milestone

Track all items in the project backlog or issue tracker.

---

## Prioritization

Prioritize debt based on:

- Customer impact
- Engineering productivity
- Security risk
- Performance impact
- Maintenance cost
- Probability of future defects

---

## Repayment Strategy

- Allocate capacity in each iteration.
- Address debt while modifying affected areas.
- Remove obsolete code instead of layering fixes.
- Refactor incrementally.

---

## Review Checklist

During reviews, verify:

- New debt is documented.
- Existing debt is not increased unnecessarily.
- Refactoring opportunities are identified.
- Short-term trade-offs are justified.

---

## Anti-Patterns

Avoid:

- TODOs without tracking.
- Permanent temporary solutions.
- Ignoring repeated code smells.
- Delaying critical security fixes.

---

## Related Documents

- REVIEW_CHECKLIST.md
- DEFINITION_OF_DONE.md
- CLEAN_ARCHITECTURE.md
- ENGINEERING_METRICS.md