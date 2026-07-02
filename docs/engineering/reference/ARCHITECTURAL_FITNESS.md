# Architectural Fitness

## Purpose

Architectural fitness functions are continuous checks that ensure the Skillar Mobile application remains aligned with its intended architecture as it evolves.

## Objectives

- Preserve Clean Architecture.
- Enforce module boundaries.
- Detect architectural drift early.
- Support long-term maintainability.

## Fitness Checks

### Structure
- Feature isolation maintained.
- Folder conventions followed.
- Layer boundaries respected.

### Dependencies
- No circular dependencies.
- No cross-feature imports.
- Domain layer independent of UI.

### Code Quality
- SOLID principles followed.
- Low duplication.
- Small focused components.

### Performance
- Startup time monitored.
- Bundle size monitored.
- Rendering performance reviewed.

### Security
- No hardcoded secrets.
- Secure storage used.
- Dependencies scanned.

## Automation

Run automatically in CI:

- TypeScript
- ESLint
- Unit tests
- Dependency audit
- Security scanning

## Review Cadence

- Every pull request.
- Every release.
- Architecture reviews.
- Major refactoring.

## Anti-Patterns

- Ignoring architecture violations.
- Untracked exceptions.
- Architecture changes without ADRs.

## Related Documents

- CLEAN_ARCHITECTURE.md
- REVIEW_CHECKLIST.md
- ENGINEERING_METRICS.md