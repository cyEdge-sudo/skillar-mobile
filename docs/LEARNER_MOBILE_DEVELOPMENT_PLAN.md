# Skillar Mobile — Learner App Development Plan

**Document status:** Planning baseline  
**Repository:** \`cyEdge-sudo/skillar-mobile\`  
**Target branch:** \`docs/learner-mobile-development-plan\`  
**Audience:** Mobile, backend, product, design, QA and security teams

---

## 1. Purpose

This document consolidates the Skillar mobile project requirements, repository documentation, supplied project guides, and the three accessible external checklist articles discussed during planning.

It defines the learner-app scope, delivery sequence, architecture constraints, feature requirements, backend dependencies, UX standards, security controls, test strategy, release criteria and decisions that remain open.

This is a planning document. It does not assert that every proposed feature or API is already implemented or available.

### Source precedence

Use sources in this order when making implementation decisions:

1. The current repository implementation and its current documentation.
2. Verified backend route handlers, DTOs, OpenAPI specification and Prisma schema.
3. The supplied Skillar project documents.
4. The external articles as supplementary checklists.
5. Engineering recommendations in this plan, clearly marked as proposals.

Do not invent API routes, response fields, status values, product requirements or design tokens to fill gaps.

## 2. Important repository alignment

The repository's current \`main\` branch README and architecture documents describe:

- Expo SDK 58, React Native 0.88.1, React 19.3 and strict TypeScript.
- React Navigation 7 with typed native-stack and bottom-tab navigation.
- TanStack Query for server state.
- React Context for the small authentication session state.
- Expo SecureStore for access and refresh tokens.
- A central API client with request IDs, timeout and cancellation support.
- Runtime parsers for untrusted API responses.
- A NestJS backend in \`skiller-backend\`, with API routes under \`/api/v1\`.
- Feature-first source structure under \`src/\`.
- Feature branches and pull requests; \`main\` is the integration branch.

The conversation's initial project profile described Expo SDK 54, React Native 0.81 and Expo Router. This conflicts with the repository's current checked-in documentation. For work in this repository, follow the checked-in implementation and docs unless the project owner explicitly approves a migration. Do not introduce Expo Router or downgrade the SDK as part of this plan.

The supplied Architecture.md also describes a different source tree and the onboarding guide describes Next.js-style \`/api/[orgSlug]\` routes. These differ from the current repository's \`src/core\`, React Navigation and versioned NestJS API contract. The current repository documentation is the implementation baseline; reconcile older supplied documents with the backend team before using their contracts.

## 3. Product vision and scope

Build a secure, maintainable, consumer-facing learner application for Skillar. The mobile app provides learner workflows. Administrative and organization-management modules are outside its scope.

### 3.1 Core product outcomes

- Learners can authenticate and maintain a secure session.
- Learners can discover and access learning roadmaps.
- Learners can view roadmap milestones, steps and lesson content.
- Learners can complete supported learning activities and assessments.
- Learners can view their persisted progress.
- Learners can access learner dashboard information.
- Learners can manage supported account/profile details.
- The app provides clear loading, empty, error, retry and access-denied states.

### 3.2 Scope boundaries

**In scope according to current repository documentation:**

- Authentication: login, signup, password reset and session management.
- Learner dashboard.
- Roadmap exploration and learning.
- Profile shell and supported learner profile operations.
- API integration using the agreed NestJS contract.
- Accessibility, security, quality and release readiness.

**Potential later scope, subject to product and backend contract approval:**

- Journeys and their stages/activities.
- Spaced-repetition reviews (flashcards and review quizzes).
- Offline content downloads and progress synchronization.
- Push notifications.
- Additional learner preferences.

**Out of scope unless separately approved:**

- Admin and organization-management screens.
- Content authoring.
- Instructor workflows.
- SCORM rendering (no mobile contract is documented).
- New payment or subscription flows.
- New notification infrastructure.

## 4. Product modules and learner workflows

### 4.1 Authentication and session

Required workflows:

1. Signup and any required verification step.
2. Login.
3. Password reset.
4. Restore an existing session at launch.
5. Refresh access credentials safely.
6. Logout and clear local credentials.
7. Handle unavailable backend and invalid sessions distinctly.

The current repository's authentication documentation defines access and refresh tokens, rotation, single-flight refresh and SecureStore persistence. Follow that contract.

### 4.2 Dashboard

The dashboard is a learner landing area. The supplied onboarding guide identifies learner KPIs such as current/longest streak, learning hours, completed tasks, activity calendar and announcements. The current repository describes the dashboard screen as a placeholder.

Before implementation, verify which dashboard fields and routes exist in the current NestJS API. Do not calculate authoritative streaks, completion percentages or learning statistics in the client.

### 4.3 Roadmaps

Roadmaps are the current repository's principal learning feature.

Expected learner flow:

1. Browse and search available roadmaps.
2. Open roadmap details.
3. Enroll where the backend permits.
4. View enrollment progress.
5. Navigate milestones and steps.
6. Load lesson content.
7. Complete supported learning activities.
8. Start and submit assessments.
9. View persisted progress and feedback returned by the backend.

The current API contract defines roadmap browsing, details, enrollment, learner enrollments, lesson content, step progress and assessment attempts. Use those documented routes only after confirming the backend implementation is available.

### 4.4 Lesson content

The supplied onboarding guide describes these roadmap step content types:

- VIDEO
- TEXT
- CAROUSEL
- EXAMPLES
- CODE
- NOTE
- QUIZ

Use typed discriminated models and isolated renderers. Parse JSON-stringified content in a mapper/validation layer, not inside screen components. Unknown or malformed content must produce a safe unsupported-content state rather than crash the screen.

The content order in the supplied onboarding guide is VIDEO, TEXT, CAROUSEL, EXAMPLES, CODE, with QUIZ handled as an assessment section. Confirm this ordering with product before treating it as a fixed UX requirement.

### 4.5 Assessments and quizzes

The current repository API contract defines assessment retrieval, attempt creation, submission and attempt-result retrieval. It specifies question answer submission using question IDs and selected option IDs.

The older onboarding guide mentions MCQ, TRUE_FALSE, MATCHING and MSQ. The current backend contract must define the supported question schema and scoring/feedback rules. Do not infer that every older question type is supported by the current API.

The backend owns scoring. The mobile app validates required input for usability but must not be the authority for correct answers or final scores.

### 4.6 Profile

The current repository includes a profile feature and documents \`GET /me\` and \`PATCH /me\`. Confirm editable fields with the backend contract before exposing profile editing. Do not add settings that have no defined product or API support.

### 4.7 Journeys and SRS reviews — later scope

The supplied onboarding/API reference documents Journey entities and SRS review payload examples, but the current repository roadmap treats Journeys as a separate product concept to add only after mobile/backend contracts are defined. The current API contract does not define Journey or SRS routes.

Before starting either feature, obtain:
- Confirmed endpoints and response schemas.
- Completion/submission semantics.
- Status enums from backend source.
- Authorization rules.
- Error and retry behavior.
- Product-approved screen and navigation behavior.

The older API reference calls out missing Journey activity completion, SRS submission and document signed-URL routes. Keep these as explicit dependencies, not assumed endpoints.

## 5. Screen inventory

This is a planning inventory. Confirm exact route names against the existing navigation tree before adding screens.

| Area | Screen / flow | Status |
|---|---|---|
| Auth | Login | Existing foundation |
| Auth | Signup | Existing foundation |
| Auth | Password reset | Existing foundation |
| Auth | Session restoration | Foundation requirement |
| Dashboard | Learner dashboard | Placeholder in repository |
| Roadmaps | Browse/search list | Placeholder / planned |
| Roadmaps | Roadmap details | Planned |
| Roadmaps | Enrollment | Contract-defined; backend readiness to verify |
| Roadmaps | Learner enrollments/progress | Contract-defined; backend readiness to verify |
| Learning | Lesson content | Planned |
| Learning | Assessment | Contract-defined; backend readiness to verify |
| Learning | Assessment result/feedback | Contract-defined; backend readiness to verify |
| Profile | Learner profile | Placeholder / planned |
| Journeys | Journey list/details/activity | Later; contract required |
| Reviews | Flashcards/review quiz | Later; contract required |
| Shared | Loading, empty, error, offline, unsupported states | Cross-cutting requirement |

### 5.1 Navigation

Use the current typed React Navigation 7 stack and bottom tabs. Do not replace it with Expo Router without a separately approved architecture migration.

Navigation must:
- Use typed route parameters.
- Avoid passing sensitive tokens or large API payloads in navigation params.
- Re-fetch protected resources after deep-link navigation.
- Treat resource IDs from external links as untrusted input.
- Handle missing or unauthorized resources with safe screens.

## 6. Architecture and code organization

### 6.1 Current repository structure

Preserve the current feature-first structure documented in the repository:

\`\`\`text
src/
  app/
    navigation/
    providers/
  core/
    api/
    auth/
    config/
    constants/
  features/
    auth/
    dashboard/
    learning/
    profile/
    roadmaps/
  shared/
    components/
    theme/
\`\`\`

Add folders only when a real feature requirement needs them. Do not replace the repository structure with an older example tree from the supplied documents.

### 6.2 Responsibilities

| Layer | Responsibility |
|---|---|
| Screens | Compose UI and connect feature hooks |
| Feature components | Feature-specific presentation |
| Feature services/hooks | Use cases, queries, mutations and mapping |
| Core API | HTTP transport, request IDs, timeout, cancellation, auth refresh and normalized errors |
| Runtime parsers | Validate unknown external payloads |
| TanStack Query | Server state, cache and invalidation |
| Auth Context | Minimal session state and learner identity |
| SecureStore | Access and refresh token persistence |
| Shared components | Feature-agnostic UI |
| Theme | Centralized design tokens and theme provider |

### 6.3 Engineering rules

- No direct \`fetch\` calls in UI components.
- Screens call feature services/hooks.
- Shared/core modules must not depend on feature modules.
- API payloads enter as \`unknown\` and pass runtime validation.
- Do not use explicit TypeScript \`any\`.
- TanStack Query owns server state.
- Do not duplicate API response data in global client state.
- Auth Context owns only session status and current learner identity.
- Centralize API paths, user-facing copy, storage keys, query keys and navigation names in \`src/core/constants/app.constants.ts\`.
- Keep business rules on the backend.
- Add or update documentation when a contract or architecture decision changes.

## 7. Backend integration plan

### 7.1 API baseline

The current repository contract specifies:
- Backend: NestJS in \`skiller-backend\`.
- Base path: \`/api/v1\`.
- Base URL configuration: backend origin only; the client appends the version prefix.
- Success envelope: \`{ data, meta }\`.
- Error envelope: \`{ error, meta }\`.
- JSON field names: camelCase.
- IDs: opaque strings.
- Timestamps: ISO 8601 UTC.
- Cursor pagination for list endpoints.
- Bearer access token on protected endpoints.
- Request ID on every request.
- Idempotency key on supported create/submit mutations.

The API contract is a target agreement, not proof that routes are deployed. Verify each endpoint in the backend before integrating a screen.

### 7.2 Current documented endpoint inventory

| Capability | Method | Route |
|---|---|---|
| Signup | POST | \`/auth/signup\` |
| Login | POST | \`/auth/login\` |
| Google sign-in | POST | \`/auth/google\` |
| Refresh | POST | \`/auth/refresh\` |
| Logout | POST | \`/auth/logout\` |
| Send email OTP | POST | \`/auth/otp/send\` |
| Verify email OTP | POST | \`/auth/otp/verify\` |
| Forgot password | POST | \`/auth/password/forgot\` |
| Reset password | POST | \`/auth/password/reset\` |
| Current learner | GET | \`/me\` |
| Update learner | PATCH | \`/me\` |
| Browse roadmaps | GET | \`/roadmaps\` |
| Roadmap details | GET | \`/roadmaps/:roadmapId\` |
| Enroll | POST | \`/roadmaps/:roadmapId/enrollments\` |
| Learner enrollments | GET | \`/me/enrollments\` |
| Enrollment details/progress | GET | \`/enrollments/:enrollmentId\` |
| Lesson content | GET | \`/steps/:stepId/content\` |
| Update step progress | PATCH | \`/enrollments/:enrollmentId/steps/:stepId/progress\` |
| Get assessment | GET | \`/steps/:stepId/assessment\` |
| Create assessment attempt | POST | \`/assessments/:assessmentId/attempts\` |
| Submit assessment | POST | \`/assessment-attempts/:attemptId/submit\` |
| Get assessment attempt | GET | \`/assessment-attempts/:attemptId\` |

### 7.3 API integration workflow

For each feature:
1. Confirm route and backend implementation.
2. Confirm request/response DTOs and error codes.
3. Add or update runtime parser.
4. Add endpoint path and query keys to centralized constants.
5. Implement feature service.
6. Implement TanStack Query hook.
7. Add loading, empty, error and retry behavior.
8. Add tests for valid and invalid payloads.
9. Invalidate relevant query keys after successful mutations.
10. Record contract changes in documentation.

### 7.4 Error behavior

Use HTTP status and stable error codes, not message-text parsing.

| Condition | Expected client behavior |
|---|---|
| Network unavailable | Connection message and retry |
| Timeout | Retry affordance |
| Cancelled request | No server-failure message |
| 400 / 422 | Safe validation feedback |
| 401 | One refresh attempt for protected calls |
| 403 | Access denied |
| 404 | Resource unavailable |
| 409 | State conflict explanation |
| 429 | Respect Retry-After when supplied |
| 5xx | Service unavailable and retry |

Do not automatically retry a mutation unless it is idempotent or protected by an idempotency key.

## 8. Design system and user experience

### 8.1 Design token policy

The supplied Skillar design-system notes confirm:
- Primary accent: \`#6C47FF\`.
- Amber accent: \`#F59E0B\`.
- Web variables \`--sk-bg\` and \`--sk-surface\` are the source of truth for backgrounds/surfaces.
- Inter is the body font; Outfit is likely for headings, but exact usage/weights need confirmation.

The full color scale, dark theme values, spacing scale, radius scale, elevation, semantic colors, icon set and typography scale are not fully specified. Request the web team's design token export or Figma source. Do not treat example token values in the supplied document as approved values.

### 8.2 Component standards

Reuse the current shared component and theme architecture. Shared components must be composable, accessible, theme-aware where applicable and free of feature-specific business logic.

### 8.3 UX checklist

The Medium article discussed in this conversation covers scrolling, touch areas, feedback, SVGs, loading/empty placeholders and iOS corner treatment. Apply the useful principles without copying sample code blindly:

- Use FlatList for large lists and ScrollView for small static content.
- Add pull-to-refresh where appropriate.
- Ensure horizontal carousels do not clip first/last items.
- Use Pressable and make the full visual control interactive where possible.
- Use hitSlop for small icons when needed.
- Provide pressed, disabled, loading, success and error feedback.
- Prevent accidental duplicate submissions.
- Use skeletons that resemble final content layout.
- Include empty, error, offline and unsupported-content states.
- Reuse the shared icon/SVG implementation.
- Use subtle motion only when it improves comprehension; respect reduced-motion settings.
- Apply platform-specific behavior only when supported and tested.

### 8.4 Accessibility

- Support screen readers and meaningful labels.
- Support OS font scaling/dynamic type.
- Maintain readable contrast.
- Do not use color alone for quiz correctness or status.
- Ensure interactive controls have usable touch targets.
- Test focus and keyboard behavior for forms.
- Provide accessible video controls and alternatives for interactive carousels.

The supplied design-system notes set a target body-text contrast ratio of at least 4.5:1, to be verified against final approved colors.

## 9. Security and privacy

Security is a release gate and a continuous engineering requirement. The Zimperium checklist is supplementary; the supplied Skillar security document and current repository auth/API documentation are the implementation baseline.

### 9.1 Authentication and credentials

- Store access and refresh tokens only in Expo SecureStore.
- Never store credentials in AsyncStorage, navigation params, query cache or logs.
- Send access tokens as Bearer credentials only to protected API routes.
- Send refresh tokens only to refresh/logout endpoints.
- Implement single-flight refresh and one retry of the original request.
- Rotate refresh tokens according to backend contract.
- If refresh is rejected, clear local tokens and return to unauthenticated state.
- If network is unavailable, do not delete a potentially valid session.
- Logout clears local credentials even if the server is unreachable.
- Scrub Authorization headers and secrets from logs and crash reports.

### 9.2 Authorization and tenant isolation

- Backend authorization is authoritative.
- Do not treat hidden UI or a client-side role as an authorization boundary.
- Re-fetch protected resources after deep-link navigation.
- Never trust an external resource ID as authorization.
- If organization switching is supported, purge old organization data before exposing the new context.

### 9.3 Data and content protection

- Use HTTPS for production traffic.
- Do not log tokens, passwords, assessment answers or sensitive learner data.
- Validate external JSON and content payloads at runtime.
- Render Markdown through a safe renderer; do not inject raw HTML.
- Do not cache signed document URLs. Confirm signed URL support and expiry with the backend.
- Review whether local database encryption is needed for the sensitivity of cached tenant content.
- Define retention/deletion expectations for learner performance data.

### 9.4 Security review caveats

Do not add certificate pinning, custom cryptography, biometric authentication, device blocking or end-to-end encryption solely because a generic checklist mentions them. Assess each against a documented threat model and operational support requirements.

### 9.5 Privacy and store disclosures

Before release:
- Audit actual API calls and collected data.
- Confirm retention and deletion requirements.
- Review crash-reporting and analytics payloads.
- Complete Apple privacy disclosures and Google Play Data Safety declarations as applicable.
- Ensure lock-screen notification previews do not expose learner scores or sensitive performance data if notifications are later approved.

## 10. Offline capability

Offline downloads and queued progress are not part of the current repository foundation. The current architecture documentation explicitly says not to implement them without an explicit backend sync design.

If offline support is approved later, first define:
- Which content can be stored.
- Whether content can be stored unencrypted.
- Cache expiry and schema versioning.
- User/tenant purge behavior.
- Which mutations may be queued.
- Idempotency and conflict handling.
- Retry/backoff policy.
- Behavior for revoked access and expired document URLs.

Do not advertise offline learning until it is implemented, security-reviewed and tested. A progress outbox should be feature-flagged and must never silently discard queued actions.

## 11. Performance and reliability

- Use FlatList for large datasets.
- Use cursor pagination where the API supports it.
- Load lesson content on demand.
- Avoid loading all roadmap content at once.
- Avoid unnecessary global state updates.
- Profile before adding memoization.
- Handle media and document loading failures.
- Cancel requests when screens no longer need them.
- Use request timeouts.
- Use bounded backoff for transient failures.
- Do not let a dashboard request block the entire app shell.
- Keep server-derived progress and streak values authoritative.

Potential monitoring measures:
- Crash-free sessions.
- Screen load time.
- API latency and error rate.
- Assessment submission success rate.
- Progress mutation failures.
- Content-rendering failures.
- Support issues and recurring defects.

Analytics/crash-reporting vendor selection is not yet defined. Make that decision only after privacy and product review.

## 12. Testing and quality assurance

### 12.1 Test levels

| Level | Coverage |
|---|---|
| Unit | Mappers, parsers, validators, utilities |
| Component | Shared components, content renderers, quiz controls |
| Integration | Feature services, query hooks and API client |
| Contract | Runtime parsers against backend DTO fixtures/OpenAPI |
| Navigation | Typed routes, deep links and unauthorized resources |
| Device | Supported Android and iOS versions/screen sizes |
| Accessibility | Screen reader, font scaling, contrast and touch targets |
| Security | Session, storage, authorization, logs and data cleanup |
| Acceptance | End-to-end learner workflows |

### 12.2 Minimum scenario coverage

**Authentication**
- Valid and invalid login.
- Signup and verification paths.
- Password reset.
- Session restoration.
- Expired access token.
- Refresh rotation and refresh rejection.
- Concurrent requests during refresh.
- Offline launch with a stored session.
- Logout when backend is unavailable.

**Dashboard**
- Loading, success, empty, error and retry.
- Pull-to-refresh.
- Cached data behavior if configured.

**Roadmaps**
- Empty and populated list.
- Search/filter/pagination.
- Roadmap details.
- Enrollment success and conflict.
- Milestones and steps.
- Unknown status values.
- Malformed content payload.
- Unknown content type.
- Lesson load failure.

**Assessments**
- Required-answer validation.
- Each backend-supported question type.
- Submission success/failure.
- Duplicate submit and idempotency.
- Attempt result and feedback.
- Navigation away during an attempt.

**Profile**
- Current learner load.
- Supported profile update fields.
- Validation and server errors.

**Cross-cutting**
- Slow/intermittent network.
- Cancellation.
- Unauthorized deep link.
- Large font size.
- Small Android screen.
- Background/foreground transition.
- No token or personal data in logs.

### 12.3 Quality gates

Run the repository's documented checks before merge:

\`\`\`bash
npm run typecheck
npm run lint
npm run format:check
\`\`\`

Add or run test scripts when available in the repository. Do not claim tests pass unless they were run and their results are recorded.

## 13. Delivery phases

The sequence below follows the current repository roadmap. Estimates are intentionally omitted until team capacity, backend readiness and scope are known.

### Phase 0 — Foundation and contract readiness

**Work**
- Inspect the current repository and installed dependencies.
- Verify current navigation, providers, API client and auth foundation.
- Confirm NestJS routes, DTOs, enums and OpenAPI availability.
- Confirm design tokens with the web/design team.
- Confirm supported Android/iOS versions.
- Resolve contract gaps before feature work.

**Deliverables**
- Repository baseline and dependency inventory.
- API readiness matrix.
- Design token source.
- Product scope and acceptance criteria.
- Open questions and risk register.

**Exit criteria**
- No unresolved contract assumption blocks the next feature.
- Existing architecture and navigation are understood.
- Required design assets are available or explicitly deferred.

### Phase 1 — Account and learner shell

**Work**
- Complete login, signup, verification and password reset.
- Implement session restoration and logout.
- Verify SecureStore and refresh behavior.
- Complete app providers, navigation and theme.
- Implement global loading/error handling.
- Complete learner shell and profile read flow where API is ready.

**Deliverables**
- Authenticated app shell.
- Secure session lifecycle.
- Typed navigation and common feedback components.

**Exit criteria**
- Auth flows match the backend contract.
- Session errors and network failures are handled safely.
- No credentials are stored outside SecureStore.

### Phase 2 — Roadmap learning

**Work**
- Browse/search roadmaps.
- Roadmap detail.
- Enrollments.
- Milestone and step navigation.
- Lesson content.
- Typed content renderers.
- Assessment attempt and result flow.
- Persisted progress.

**Deliverables**
- End-to-end roadmap learning workflow.
- Runtime schemas and feature services.
- Loading, empty, error and retry states.
- Unit, integration and contract tests.

**Exit criteria**
- Learners can complete a supported roadmap flow against implemented backend routes.
- Server remains authoritative for enrollment, scoring and progress.

### Phase 3 — Journeys and supporting capabilities (conditional)

Start only after the product and backend contracts are approved.

**Potential work**
- Journey list and details.
- Stages and activities.
- Task, video and document renderers.
- Roadmap redirect from Journey activity.
- Assessment activity.
- Journey activity completion.
- Notifications, if approved and supported.

**Deliverables**
- Verified Journey API contract.
- Journey learner workflow.
- Supported activity renderers.
- Explicit unsupported-content fallback.

**Exit criteria**
- Every shipped activity type has a verified backend contract and tested completion behavior.

### Phase 4 — Offline support (conditional)

Start only after backend synchronization and security design are approved.

**Potential work**
- Persistent content cache.
- Content schema versioning.
- Offline availability indicators.
- Progress outbox.
- Idempotent synchronization.
- Conflict and retry handling.
- Logout/tenant purge.

**Deliverables**
- Approved offline data policy.
- Offline cache and sync implementation.
- Recovery and data-loss tests.

**Exit criteria**
- No silent loss or duplicate progress mutation in tested failure scenarios.
- Security review approves local data handling.

### Phase 5 — Production readiness

**Work**
- Unit/integration/contract regression.
- End-to-end Android and iOS validation.
- Accessibility review.
- Performance profiling.
- Security review and dependency audit.
- Privacy/data disclosure audit.
- Release build validation.
- Support and incident response readiness.

**Deliverables**
- QA report.
- Security review evidence.
- Accessibility/performance report.
- Release candidate and release checklist.

**Exit criteria**
- No unresolved critical security findings or release-blocking defects.
- Required quality checks pass.
- Store disclosures match actual data collection.

## 14. Acceptance criteria

The application is ready for release only when all applicable criteria are met:

| Area | Acceptance criteria |
|---|---|
| Authentication | Secure login, session restore, refresh and logout |
| API | Verified contracts, runtime parsing and normalized errors |
| Dashboard | Correct server data and complete loading/error/empty behavior |
| Roadmaps | Browse, details, enrollment and supported learning flow |
| Content | Safe rendering of all shipped content types |
| Assessments | Validated submission and backend-owned results |
| Profile | Only confirmed editable fields are exposed |
| UX | Pressed/loading/success/error/empty states are consistent |
| Accessibility | Screen reader, font scaling, contrast and touch-target checks |
| Security | Secure token storage, authorization and safe logging |
| Performance | Responsive list and lesson loading on supported devices |
| Compatibility | Regression passes on supported Android/iOS versions |
| Release | Privacy disclosures, permissions, assets and operational readiness |

Journeys, Reviews and offline criteria become release requirements only if those features are included in the approved release scope.

## 15. Risks and dependencies

| Risk / dependency | Impact | Mitigation |
|---|---|---|
| SDK/navigation discrepancy between initial project profile and repository | High | Follow current repository baseline; get explicit approval before migration |
| Supplied older API routes differ from current NestJS contract | High | Use current API contract and verify backend implementation |
| Backend endpoints not yet deployed | High | Gate feature work on backend readiness |
| Incomplete assessment question schemas | High | Confirm DTOs and supported types |
| Design token gaps | Medium | Obtain token export; do not guess |
| Journey API not defined in current contract | High | Keep Journey phase conditional |
| SRS API not defined in current contract | Medium | Keep Reviews phase conditional |
| Signed document URL contract absent | Medium | Verify before implementing document download |
| Offline conflict/idempotency contract absent | High | Defer offline mutations until agreed |
| Cached tenant data exposure | High | Define encryption and purge policy |
| Analytics/privacy vendor undecided | Medium | Complete privacy review before integration |

## 16. Success measures

Agree targets with product before launch. Candidate measures:

- Monthly active learners.
- Roadmap browse-to-enrollment conversion.
- Roadmap step completion rate.
- Assessment submission success rate.
- Learner session frequency.
- Crash-free sessions.
- API error and latency rates.
- Lesson screen load time.
- Support ticket volume and recurring failure categories.

Do not collect more learner data than needed. Define event names, retention and access controls before enabling analytics.

## 17. Decisions required

Resolve these with the relevant owners:

1. Confirm that the current repository stack (Expo SDK 58 / React Native 0.88.1 / React Navigation 7) supersedes the earlier SDK 54 / RN 0.81 / Expo Router project profile.
2. Confirm the current backend route implementation and OpenAPI source.
3. Confirm supported assessment question types and payloads.
4. Confirm dashboard data fields and endpoint readiness.
5. Confirm editable profile fields.
6. Obtain complete design tokens and typography details.
7. Confirm supported Android and iOS OS versions.
8. Decide whether Journeys are part of the first learner release.
9. Decide whether SRS Reviews are part of the first learner release.
10. Decide whether offline reading or offline progress submission is required.
11. Confirm document signed-URL behavior if DOCUMENT activities are in scope.
12. Confirm analytics/crash-reporting vendor and privacy requirements.

## 18. External references considered

These articles are supplementary checklists, not Skillar product or API specifications:

1. **Medium — Mobile App Checklist Basics-I**  
   https://medium.com/timeless/mobile-app-checklist-basics-i-35464bb325d0  
   Applied topics: scrolling, touch areas, interaction feedback, SVGs, loading/empty placeholders and platform-specific corner treatment.

2. **Zimperium — Mobile App Security Checklists**  
   https://zimperium.com/glossary/mobile-app-security-checklists  
   Applied topics: lifecycle security, data protection, authentication, network security, secure storage, logging, testing and maintenance. Recommendations such as certificate pinning or custom encryption require a project threat-model decision; they are not automatic requirements.

3. **Appinventiv — 76-Point Checklist for Mobile App Development First-Timers**  
   https://appinventiv.com/blog/76-point-checklist-for-mobile-app-development-first-timers/  
   Applied topics: discovery, technology readiness, UI, development planning, performance, security, testing, branding, release and metrics. It is a general older checklist; vendor selection and monetization sections are not assumed to apply to Skillar.

The first Google share link supplied earlier in the conversation could not be inspected. Its contents are not represented in this plan. Add it only after an accessible document or upload is provided.

---

## 19. Recommended immediate next steps

1. Confirm the repository stack discrepancy with the project owner.
2. Ask backend to mark each current API contract route as implemented, in progress or not planned.
3. Obtain the web design token export.
4. Complete Phase 0 readiness checks.
5. Start with the authenticated learner shell, then dashboard and Roadmaps.
6. Keep Journeys, Reviews and offline synchronization gated on explicit product/API decisions.

**Planning principle:** Ship only workflows backed by verified contracts. Preserve the current repository architecture. Treat security, accessibility, error handling and testing as part of each feature rather than final-stage additions.
