# Contributing to Skillar Mobile

Thank you for contributing to the Skillar Mobile project. This repository follows a documentation-first and architecture-driven development process.

## Development Workflow

1. Review the relevant documentation before starting work.
2. Update or create documentation for any significant feature or architectural change.
3. Implement the feature.
4. Ensure all quality checks pass.
5. Submit for review.

## Branching Strategy

- `main` – Production-ready code.
- `develop` – Active development.
- `feature/<feature-name>` – New features.
- `bugfix/<issue-name>` – Bug fixes.
- `hotfix/<issue-name>` – Production fixes.

## Commit Message Convention

Use Conventional Commits:

- feat:
- fix:
- docs:
- refactor:
- test:
- chore:
- perf:
- ci:

Example:

```
feat(auth): implement secure login flow
```

## Pull Request Checklist

- Documentation updated.
- Code follows project architecture.
- No TypeScript `any` usage.
- Loading, error, and empty states handled.
- Accessibility considered.
- Tests added or updated where applicable.
- Linting passes.

## Documentation-First Principle

Every major feature should be documented before implementation. Architectural changes must be captured using an Architecture Decision Record (ADR).

## Definition of Done

A feature is considered complete when:

- Functional requirements are met.
- Documentation is updated.
- Code review is completed.
- Quality checks pass.
- Performance and security considerations have been addressed.

## AI-Assisted Development

AI-generated code should:

- Adhere to the documented architecture.
- Follow the design system.
- Avoid introducing unnecessary dependencies.
- Maintain strict TypeScript typing.
- Preserve readability and maintainability.

## Code Review Principles

Reviews should focus on:

- Correctness
- Maintainability
- Performance
- Security
- Accessibility
- Consistency with project standards
