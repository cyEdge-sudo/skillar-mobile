# Journeys mobile module

This module adds the learner-facing Journeys list and enrollment detail screens. It follows the existing React Navigation, TanStack Query, API client, shared component, and theme architecture.

## API contract

The client uses the authenticated API v1 routes implemented by the backend mobile journeys module:

- `GET /api/v1/me/journeys?limit=20&cursor=...`
- `GET /api/v1/journeys/enrollments/:enrollmentId`
- `POST /api/v1/journeys/enrollments/:enrollmentId/activities/:activityId/complete`

The mobile service validates the response envelope at the API boundary. It does not perform client-side security-tag filtering. The backend remains responsible for learner ownership, organization scope, and stage-unlock authorization.

These routes are currently defined in the backend branch `feature/mobile-journeys-api` (PR #684). The navigation and detail route are disabled by default through `FEATURE_FLAGS.journeys`. Enable the flag only after that backend change is merged, deployed, and smoke-tested against the configured API environment.

## Supported activity behavior

- TASK: render the task body as Markdown; allow completion.
- VIDEO: open supported HTTPS YouTube links externally; allow completion.
- ACKNOWLEDGEMENT: display acknowledgement text; allow completion.
- ROADMAP: navigate to the existing roadmap detail screen; completion remains owned by roadmap progress.
- ASSESSMENT: show learner-safe question previews only. Submission is not available in this mobile version.
- DOCUMENT: show an unavailable state until a secure signed-URL flow exists.
- SCORM and unknown activity types: show an explicit unsupported state; do not attempt speculative rendering.

Completion percentage, stage unlocks, and access control are read from the server. The client does not reimplement those rules.

## Follow-up work

- Add assessment submission when the backend contract is available.
- Add secure document access after a signed-URL exchange endpoint is implemented.
- Add an offline completion outbox only after idempotency, conflict handling, and tenant-scoped cache clearing are covered.
- Consider an embedded YouTube player if the product requires inline playback.
