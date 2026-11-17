# ADR-0001: Feature boundaries and application composition

- **Status:** Accepted
- **Date:** 2026-11-17
- **Decision owners:** Skillar Mobile maintainers

## Context

The Roadmaps detail screen needs data from both the Roadmaps and Learning capabilities. The previous implementation placed that composition in the Roadmaps feature and imported Learning internals. That creates a feature-to-feature dependency and makes feature ownership harder to enforce.

The architecture handbook requires features to remain self-contained, forbids imports of another feature's internals, and assigns application composition to `src/app`.

## Decision

1. Feature modules may depend on `core` and `shared`, but must not import another feature.
2. A feature exposes supported integration points through its `index.ts` public API.
3. Cross-feature workflows are composed in `src/app` using only feature public APIs.
4. `core` and `shared` remain feature-agnostic.
5. CI runs an architecture fitness check that rejects cross-feature imports, core/shared-to-feature imports, app imports of feature internals, and cycles within a feature.

## Consequences

- Feature ownership is clearer and internal files can change without breaking other features.
- Application composition becomes the explicit integration boundary.
- New public exports must be deliberate.
- The fitness check is intentionally static and local-import based. It does not replace code review or a full dependency-graph analysis.
- Existing cross-feature imports must be migrated before this rule can pass.

## Alternatives considered

- **Keep the composition inside Roadmaps:** rejected because it makes Roadmaps depend on Learning internals.
- **Move shared workflow logic into a new global service:** rejected because this workflow is currently navigation-level composition, not a reusable domain capability.
- **Allow direct imports between features:** rejected because it weakens the documented feature boundary.
