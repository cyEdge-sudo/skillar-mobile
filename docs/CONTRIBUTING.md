# Contributing to Skillar Mobile

This repository follows a documentation-first and architecture-driven process.

## Development workflow

1. Review the relevant architecture and API documentation.
2. Create a feature or fix branch from the current `main`.
3. Update documentation for contract or architecture changes.
4. Implement the change.
5. Run typecheck, lint and formatting checks.
6. Open a pull request against `main`.

## Branch names

- `main` – Protected integration branch.
- `feature/<feature-name>` – New features.
- `bugfix/<issue-name>` – Bug fixes.
- `hotfix/<issue-name>` – Production fixes.

A separate long-lived `develop` branch is not required for the current workflow.

## Commit messages

Use Conventional Commits:

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`
- `perf:`
- `ci:`

Example:

```text
feat(auth): implement secure login flow
```

## Pull request checklist

- Documentation updated.
- Code follows the feature-first architecture.
- No explicit TypeScript `any`.
- External data is validated at runtime.
- Loading, error and empty states are handled.
- Accessibility is considered.
- Tests are added or updated where applicable.
- Typecheck and lint pass.
- No credentials or generated agent artefacts are committed.

## Definition of done

A change is complete when:
- Functional requirements are met.
- Documentation is current.
- Review comments are resolved.
- Quality checks pass.
- Performance and security risks are addressed.
