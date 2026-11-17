# Skillar Mobile — Implementation Audit & Redesign Plan

**Document status:** Audit and redesign execution plan  
**Repository:** `cyEdge-sudo/skillar-mobile`  
**Target branch:** `docs/learner-mobile-development-plan`  
**Audience:** Product, design, mobile, backend, QA, security and DevOps

---

## 1. Purpose

This plan governs a ground-up audit of the current Skillar learner mobile application, followed by a controlled redesign and implementation improvement programme.

The goal is not to rewrite the application by default. The goal is to establish an evidence-based picture of the current product and technical state, identify risks and gaps, agree on a target experience and architecture, then improve the application in small, verifiable increments.

The work has four outcomes:

1. **Understand the baseline:** establish what exists, what works, what is incomplete and what is unsafe.
2. **Define the target:** agree on product workflows, visual design, architecture, API contracts and operational requirements.
3. **Improve the implementation:** retain sound foundations, refactor weak areas and replace components only where evidence supports it.
4. **Prove readiness:** validate quality, security, performance, scalability and operational recovery before release.

This document is an audit and execution framework. It does not claim that any listed capability currently exists.

## 2. Guiding principles

- Audit before changing implementation.
- Record evidence for every significant finding.
- Do not confuse repository documentation with verified runtime behavior.
- Do not confuse a successful build with a production-ready application.
- Preserve working code unless there is a clear reason to change it.
- Prefer incremental refactoring over a high-risk rewrite.
- Keep product decisions, design decisions and technical decisions traceable.
- Treat mobile, backend, infrastructure and operations as one system with clear ownership.
- Make security, accessibility, testing and observability part of each workstream.
- Do not add infrastructure or third-party services without a defined need, owner and operating cost.
- Define scale targets from expected traffic and service-level objectives; do not claim capacity for millions of users without measurement.
- Do not introduce offline-first behavior, certificate pinning, custom cryptography or other high-impact mechanisms without approved requirements and threat models.

## 3. Project baseline and source precedence

The existing learner development plan records a repository documentation baseline of Expo SDK 58, React Native 0.88.1, React 19.3, React Navigation 7, TanStack Query, a minimal authentication Context, Expo SecureStore and a NestJS backend under `/api/v1`.

The initial project profile in the conversation described Expo SDK 54, React Native 0.81 and Expo Router. This conflicts with the repository baseline. During the audit, verify the actual `package.json`, lockfile, native project configuration, CI workflows and current source code. Do not migrate SDK or navigation as part of the audit unless the owner approves a separate migration decision.

Use this source precedence:

1. Current checked-out source, lockfile, build configuration and automated tests.
2. Verified backend route handlers, DTOs, OpenAPI specification and database schema.
3. Current repository engineering and architecture documentation.
4. Supplied Skillar architecture, design-system, security and API documents, after reconciling conflicts.
5. External checklists as prompts for investigation, not as product specifications.
6. Recommendations in this document, which remain proposals until approved.

Where sources conflict, record the conflict and its owner. Do not silently choose a convenient interpretation.

## 4. Audit method and evidence requirements

### 4.1 Finding categories

Classify every finding using one of these statuses:

- **Verified:** reproduced or confirmed directly in source, tests, configuration or a live environment.
- **Partially verified:** evidence exists, but coverage or behavior is incomplete.
- **Not verified:** no reliable evidence yet.
- **Not applicable:** the capability is outside approved product scope.
- **Blocked:** verification needs access, a backend change, a product decision or another dependency.

Classify severity:

| Severity | Meaning | Expected handling |
|---|---|---|
| Critical | Exploitable security issue, data loss, severe privacy issue or release-blocking failure | Stop affected release/workflow and escalate immediately |
| High | Core learner workflow failure, authorization flaw, recurring crash or major reliability risk | Prioritize before feature expansion |
| Medium | Significant usability, maintainability, performance or test gap | Schedule in the relevant workstream |
| Low | Minor inconsistency or improvement | Backlog and address when practical |

Every finding must include:
- Unique ID and short title.
- Area and affected workflow.
- Evidence: file/line, test, API trace, screenshot, recording or reproducible steps.
- Expected behavior and observed behavior.
- Severity and user/business impact.
- Recommended action: keep, fix, refactor, replace, defer or remove.
- Owner, dependencies and acceptance criteria.
- Verification method and final status.

Do not mark a finding as fixed until the relevant verification has passed.

### 4.2 Audit outputs

Maintain these working artefacts in the repository or agreed project workspace:

1. Current-state inventory.
2. Screen and user-journey inventory.
3. Architecture and dependency map.
4. API/backend contract matrix.
5. Design and usability findings.
6. Security and privacy findings register.
7. Test coverage and quality-gate report.
8. Performance and reliability baseline.
9. Infrastructure and deployment review.
10. Prioritized remediation backlog.
11. Target design and architecture decisions.
12. Release-readiness report.

## 5. Workstream A — Product and user experience audit

### 5.1 Product scope and user journeys

- Confirm learner personas, supported roles and organization/tenant behavior.
- List every current screen, route, modal, deep link and entry point.
- Map critical journeys from app launch through authentication, dashboard, roadmap discovery, enrollment, lesson consumption, assessment, progress and profile.
- Identify dead ends, duplicate flows, inconsistent navigation and unfinished screens.
- Compare implemented behavior with approved product requirements.
- Identify unsupported or undocumented behavior that has become part of the current experience.
- Confirm which features are in the first release and which are later scope.

**Deliverable:** approved screen inventory, journey maps and product gap register.

### 5.2 UI and visual redesign audit

Inspect each screen for:

- Alignment with the approved Skillar design system.
- Typography, colors, spacing, sizing, radii, elevation and icon consistency.
- Layout hierarchy and information density.
- Navigation clarity and consistency.
- Forms, validation and error copy.
- Loading, skeleton, empty, offline, error, success and unsupported states.
- Touch targets, pressed/disabled states and duplicate-action prevention.
- Small-screen behavior, long text, large fonts and orientation where supported.
- Dark-mode behavior only if it is an approved product requirement.
- Image, video, document and carousel behavior.
- Scroll indicators, refresh behavior, bounce behavior and horizontal content insets.
- Motion, transitions and reduced-motion behavior.

Do not invent design tokens to fill gaps. Obtain the approved Figma file or design-token export. Record missing tokens and request design-owner decisions.

**Redesign sequence:**
1. Information architecture and navigation.
2. Low-fidelity wireframes for critical journeys.
3. Design-system token and component mapping.
4. High-fidelity screen designs.
5. Interactive prototype review.
6. Accessibility and edge-state review.
7. Product/design approval.
8. Implementation and visual regression.

**Deliverable:** approved screen specifications, component inventory and design-system mapping.

### 5.3 Accessibility and usability

- Verify screen-reader labels, roles and reading order.
- Verify text scaling and content reflow.
- Verify color contrast against approved tokens.
- Verify keyboard and focus behavior in forms.
- Verify touch target size and spacing.
- Avoid using color alone to communicate status or correctness.
- Provide accessible media controls and alternatives for interactive content.
- Test key workflows with accessibility services on real devices.

**Deliverable:** accessibility findings and agreed remediation criteria.

## 6. Workstream B — Mobile implementation and architecture audit

### 6.1 Repository and build foundation

Start with the basics:

- Confirm repository status, branch policy and ownership.
- Inspect `package.json`, lockfile and all direct/transitive native dependencies.
- Confirm Expo SDK, React Native, React and navigation versions from installed source and build output.
- Inspect app configuration, plugins, Android/iOS configuration and environment handling.
- Reproduce a clean install and development build using documented commands.
- Verify release builds, signing configuration and environment selection without exposing secrets.
- Inspect lint, typecheck, formatting and test scripts.
- Identify abandoned packages, duplicate libraries, unsafe packages and unnecessary native modules.
- Confirm dependency updates are controlled and reproducible.

**Deliverable:** reproducible build instructions and dependency inventory.

### 6.2 Architecture and code quality

Audit the actual source tree and dependency direction. Review:

- Screen/component responsibility boundaries.
- Feature modules and shared components.
- Business logic separation from presentation.
- API client and service boundaries.
- Runtime validation of external data.
- State ownership and data flow.
- Navigation typing and deep-link handling.
- Error boundaries and global error handling.
- Reusable component quality and duplication.
- TypeScript strictness and unsafe casts.
- Naming, file size, complexity and testability.
- Circular dependencies and feature-to-feature coupling.
- Accessibility implementation.
- Comments and documentation that no longer match behavior.

The current repository plan describes a feature-first structure under `src/app`, `src/core`, `src/features` and `src/shared`. Verify the implementation before changing it. Do not force files into this structure if the current repository has a newer approved convention.

**Deliverable:** architecture map, dependency direction review and refactoring backlog.

### 6.3 Navigation and app lifecycle

- Inventory all registered routes and route parameters.
- Verify unauthenticated and authenticated navigation paths.
- Verify app launch, session restoration, background/foreground and process recreation.
- Verify deep links and invalid or unauthorized resource IDs.
- Verify Android back behavior and platform-specific navigation behavior.
- Verify state restoration only where required and safe.
- Ensure credentials and sensitive learner data are not passed in navigation params.

**Deliverable:** navigation map and lifecycle test results.

### 6.4 State, caching and data lifecycle

- Identify local state, shared state and server state.
- Verify TanStack Query configuration, query keys, invalidation and stale-data behavior.
- Check cache ownership, expiry and memory use.
- Check behavior on logout and organization/tenant switch.
- Confirm sensitive data is not placed in persistent or shared caches without approval.
- Check cancellation of obsolete requests.
- Document which data must be available after app restart.

Offline-first storage is not a default requirement. The current architecture defers offline downloads and queued progress until backend synchronization, data protection and conflict behavior are agreed. Audit current behavior and preserve this gate.

**Deliverable:** state/cache map and data-retention/purge requirements.

### 6.5 Mobile performance and resilience

Measure before optimizing:

- Cold and warm startup time.
- Screen transition responsiveness.
- List rendering and pagination.
- Lesson and media loading.
- JavaScript and native memory behavior.
- Main-thread/UI responsiveness and frame drops.
- Image sizing, decoding and caching.
- Request timeout, cancellation and retry behavior.
- Behavior during slow, intermittent and unavailable networks.
- Behavior after backgrounding or process termination during an action.
- Battery and data usage for long learning sessions.

Use FlatList or an appropriate virtualized list for large datasets. Avoid loading full roadmaps or large media payloads unnecessarily. Move expensive work off the UI path using supported platform/library mechanisms only when profiling shows a need.

**Deliverable:** performance baseline, bottleneck report and prioritized fixes.

## 7. Workstream C — API and backend audit

### 7.1 Contract verification

For every mobile-used endpoint:

- Confirm the route exists in the current backend.
- Confirm authentication and authorization requirements.
- Confirm request and response DTOs.
- Confirm validation and stable error codes.
- Confirm pagination and sorting behavior.
- Confirm idempotency support for retryable mutations.
- Confirm timeout and cancellation behavior.
- Confirm rate limits and Retry-After behavior.
- Confirm media upload/download and signed URL behavior where relevant.
- Compare backend behavior with mobile runtime parsers and tests.

The current repository documentation describes a NestJS API under `/api/v1`, success/error envelopes, opaque IDs, UTC timestamps and cursor pagination. Treat these as contract expectations until verified against backend source and deployed environments.

### 7.2 Backend correctness and authorization

- Verify authorization on every protected endpoint.
- Verify tenant isolation at query and mutation boundaries.
- Verify object-level access checks for roadmap, enrollment, step and assessment IDs.
- Verify server-side validation and business rules.
- Verify scoring and progress are server-authoritative.
- Verify duplicate submissions and concurrent updates.
- Verify stable error responses and safe error details.
- Verify audit logging for security-relevant actions without logging secrets or sensitive learner content.

**Deliverable:** endpoint readiness matrix and backend security findings.

### 7.3 Backend scalability and data layer

Review with backend owners:

- Stateless request handling and shared session/token strategy.
- Horizontal scaling and load-balancer behavior.
- Database indexes for measured query patterns.
- Connection pool sizing and exhaustion behavior.
- Query plans and slow-query visibility.
- Transaction boundaries and concurrency behavior.
- Read replicas only where consistency requirements permit.
- Distributed caching only for measured high-value reads, with invalidation and tenant isolation.
- Background queues for work that should not block API requests.
- CDN/media delivery, cache headers and signed URL expiry.
- API gateway, request validation, rate limits and abuse controls.
- Database backup, restore and disaster-recovery procedures.

Do not add Redis, Kafka, RabbitMQ, SQS, read replicas or a new gateway merely because a checklist names them. Select infrastructure from measured bottlenecks, consistency requirements, expected traffic, team capability and operating cost.

**Deliverable:** backend capacity and architecture review with evidence-backed recommendations.

## 8. Workstream D — Security and privacy audit

Treat security findings as release gates. Use the Skillar security document and current backend authentication contract as primary references.

### 8.1 Mobile security

- Verify access and refresh tokens are stored only in Expo SecureStore.
- Verify tokens are absent from AsyncStorage, logs, analytics, crash reports, navigation params and query cache.
- Verify refresh is single-flight and the original request is retried no more than once.
- Verify refresh rejection clears credentials.
- Verify transient network failure does not incorrectly destroy a valid session.
- Verify logout clears local credentials even when the backend is unavailable.
- Inspect permissions, deep links, exported Android components and app configuration.
- Inspect local files, caches, screenshots and clipboard behavior for sensitive data exposure.
- Validate external payloads and render rich content safely.
- Review dependencies and native SDK data collection.

### 8.2 Backend and transport security

- Verify HTTPS in production and secure transport configuration.
- Verify authorization and tenant isolation on the server.
- Verify secrets are stored in approved secret management systems.
- Verify rate limiting, abuse protection and input validation.
- Verify logs redact tokens, passwords and sensitive learner data.
- Review encryption at rest and backup protection for sensitive data.
- Review certificate pinning only if a documented threat model justifies the operational complexity.

### 8.3 CI security controls

Evaluate automated controls for:

- Secret scanning.
- Dependency vulnerability scanning.
- License policy checks where required.
- Static analysis and unsafe-code checks.
- Build artifact and signing-key protection.
- Infrastructure configuration scanning where infrastructure-as-code exists.

**Deliverable:** threat review, security findings register and remediation evidence.

## 9. Workstream E — Testing and quality engineering

### 9.1 Test strategy

Establish a test pyramid that matches the actual repository and tools:

| Level | Required focus |
|---|---|
| Static checks | TypeScript, lint, formatting, dependency and secret checks |
| Unit | Parsers, mappers, validators, business rules and utilities |
| Component | Shared components, forms, content renderers and feedback states |
| Integration | API client, auth refresh, feature services and query hooks |
| Contract | Mobile parsers against verified backend DTO/OpenAPI fixtures |
| Navigation | Auth gates, deep links, invalid IDs and back behavior |
| End-to-end | Signup/login, roadmap discovery, enrollment, lesson and assessment |
| Device | Supported Android/iOS versions, screen sizes and memory classes |
| Accessibility | Screen reader, font scaling, contrast, keyboard and touch targets |
| Security | Token lifecycle, authorization, tenant isolation, logging and purge |
| Performance | Startup, scrolling, memory, media and API latency |

### 9.2 Failure and resilience scenarios

Test at least:

- Slow network, connection loss and recovery.
- Request timeout and cancellation.
- Repeated taps and duplicate mutation attempts.
- Expired access token and rejected refresh token.
- App backgrounded or terminated during a mutation.
- Backend 4xx, 5xx and rate limiting.
- Malformed, empty and unknown API payloads.
- Large lists and large text.
- Low-memory devices and constrained storage.
- Permission denial or revocation.
- App upgrade with cached data from the previous version.
- Logout and tenant change with cached data.

Do not use destructive chaos tests against production. Run controlled fault injection in isolated non-production environments.

### 9.3 CI quality gates

Define branch-protection checks and required pull-request gates. At minimum, evaluate:

- Install from the committed lockfile.
- Typecheck.
- Lint.
- Format check.
- Unit and component tests.
- API contract tests.
- Dependency and secret scanning.
- Build validation for supported targets.

Add gates in stages based on current repository capability. A check must have a clear owner, reliable result and documented failure procedure before it becomes a required merge gate.

**Deliverable:** test coverage map, CI gate definition and QA report.

## 10. Workstream F — Environments, deployment and operations

### 10.1 Environment separation

Define Development, Staging and Production with:

- Separate backend services and databases.
- Separate credentials and secret scopes.
- Environment-specific API origins and app configuration.
- Controlled access to production data.
- No production secrets in source control or local sample files.
- Clear data seeding and reset procedures for non-production.
- Release build verification against the intended environment.

### 10.2 Observability

Agree on tools only after privacy and ownership review. Define:

- Crash and fatal-error reporting.
- Android ANR and iOS hang reporting where supported.
- Startup and screen performance.
- API latency, error rate and timeout rate.
- Assessment and progress mutation success/failure.
- Backend service health and database saturation.
- Correlation/request IDs across mobile and backend.
- Distributed tracing where the backend architecture supports it.
- Alerts with severity, owner, runbook and escalation path.

Do not send tokens, passwords, assessment answers or sensitive learner data to monitoring services. Define event retention and access controls.

### 10.3 Feature flags, emergency controls and app versions

- Identify features that need remote disablement due to operational risk.
- Keep authorization and security enforcement on the backend; a feature flag is not an authorization control.
- Define safe defaults when the flag service is unavailable.
- Avoid wrapping every small UI element in a remote flag.
- Define minimum supported app version and API compatibility policy.
- Define when an upgrade is optional, recommended or mandatory.
- Ensure a force-update screen has a safe recovery path and does not trap users during a service outage.
- Define emergency kill-switch ownership, audit trail and rollback procedure.

### 10.4 Release and recovery

- Use staged rollout where the distribution platform supports it.
- Define rollout cohorts and observation windows.
- Define crash, ANR, API error and support thresholds for pause/rollback.
- Verify rollback and hotfix procedures.
- Use backward-compatible API and database changes during mixed-version rollout.
- Prefer expand-and-contract database migrations.
- Test backup restoration and disaster recovery.
- Maintain incident runbooks and on-call ownership.

**Deliverable:** environment matrix, observability plan, release checklist and incident runbooks.

## 11. Redesign and implementation sequence

The audit should proceed in gates. Do not start a broad rewrite before the first two gates are complete.

### Gate 0 — Access and reproducibility

**Activities**
- Confirm repository and environment access.
- Reproduce clean install, typecheck, lint, tests and development build.
- Confirm supported devices and build targets.
- Identify missing access to backend, design files and CI.

**Exit criteria**
- Baseline commands and results are recorded.
- Blocking access gaps have owners.

### Gate 1 — Current-state audit

**Activities**
- Complete product, screen, navigation and user-journey inventory.
- Map mobile architecture, dependencies, state and API usage.
- Verify authentication and security controls.
- Capture UI/UX and accessibility findings.
- Measure performance and test coverage.
- Review backend, database, infrastructure and deployment with their owners.

**Exit criteria**
- Findings have evidence, severity and owners.
- Critical security and data-loss risks are escalated.
- Current-state architecture and workflow maps are reviewed.

### Gate 2 — Target design and architecture

**Activities**
- Confirm product scope and release priorities.
- Approve user journeys and information architecture.
- Approve design tokens and component specifications.
- Record architecture decisions and migration risks.
- Confirm API contracts and backend ownership.
- Agree scale assumptions, SLOs and privacy requirements.

**Exit criteria**
- Product and design approve the target workflows and screens.
- Engineering owners approve the architecture and API boundaries.
- No critical unknown blocks the first implementation slice.

### Gate 3 — Foundation remediation

**Activities**
- Fix build, environment, dependency and CI issues.
- Fix critical security and session issues.
- Establish shared theme, typography, layout and component foundations.
- Establish navigation and common loading/error/empty patterns.
- Establish runtime parsing, API error handling and test conventions.

**Exit criteria**
- Clean builds and required checks pass.
- Foundation components meet design and accessibility requirements.
- Auth and API foundations have automated coverage.

### Gate 4 — Incremental redesign and feature delivery

Deliver one vertical slice at a time:

1. App launch, session restoration and authentication.
2. Learner shell and navigation.
3. Dashboard.
4. Roadmap browse and details.
5. Enrollment and learner progress.
6. Lesson content.
7. Assessment and result.
8. Profile and approved account operations.

For each slice:
- Confirm acceptance criteria and API readiness.
- Complete approved design and edge states.
- Implement UI, feature logic and API integration.
- Add automated tests.
- Verify accessibility and supported devices.
- Review telemetry and performance.
- Obtain product/design acceptance before moving on.

Journeys, SRS reviews, offline downloads, push notifications and payments remain outside the baseline until explicitly approved and supported by verified contracts.

### Gate 5 — Scale and operational readiness

**Activities**
- Run load and stress tests against staging using agreed traffic profiles.
- Measure API, database and mobile performance.
- Tune only measured bottlenecks.
- Validate rate limits, queues, caching and CDN behavior where implemented.
- Verify observability, alerts, runbooks, rollback and database migration compatibility.
- Conduct security, privacy and accessibility reviews.

**Exit criteria**
- Agreed SLOs and capacity targets are met in representative tests.
- No unresolved critical security findings remain.
- Operational owners can detect, triage and recover from known failure modes.

### Gate 6 — Controlled release and post-release audit

**Activities**
- Release to a limited cohort where supported.
- Monitor crash, ANR, API and key learner workflow metrics.
- Pause rollout when agreed thresholds are crossed.
- Expand gradually after observation.
- Review support feedback and production incidents.
- Convert findings into the next prioritized improvement cycle.

**Exit criteria**
- Release thresholds are met.
- Rollback and support processes are operational.
- Post-release findings have owners and due dates.

## 12. Prioritization model

Prioritize work using:

1. Security, privacy and data integrity risk.
2. Core learner workflow impact.
3. Crash frequency and severity.
4. Reliability and performance impact.
5. Accessibility and usability impact.
6. Maintainability and delivery risk.
7. Infrastructure cost and operational complexity.

Do not prioritize a technology because it appears in a generic checklist. For each proposed change, record:

- Problem and evidence.
- Expected user/system benefit.
- Alternatives considered.
- Implementation and operating cost.
- Migration and rollback risk.
- Owner and measurable acceptance criteria.

## 13. Scale, reliability and success measures

Before selecting infrastructure or claiming scale readiness, product and engineering must agree on:

- Expected registered and monthly active learners.
- Expected concurrent sessions.
- Peak API requests per second and traffic patterns.
- Media bandwidth and storage expectations.
- Geographic distribution and latency expectations.
- Availability and recovery objectives.
- Data retention and backup requirements.
- Budget and operational staffing.

Candidate measures include:

| Area | Measure |
|---|---|
| Mobile stability | Crash-free sessions, crash rate and ANRs |
| Mobile performance | Startup time, screen readiness, frame drops and memory |
| API | p50/p95/p99 latency, error rate and timeout rate |
| Database | Query latency, connection saturation and slow queries |
| Learning workflows | Enrollment, progress and assessment submission success |
| Operations | Detection time, recovery time and rollback time |
| Quality | Automated test coverage and escaped defect rate |
| Accessibility | Critical workflow audit completion and defect count |

Set numeric targets only after baseline measurement and owner agreement. A target such as 99.8% crash-free sessions is a proposal, not an automatic acceptance threshold.

## 14. Key risks and guardrails

| Risk | Guardrail |
|---|---|
| Rewriting stable areas without evidence | Require findings and migration rationale before replacement |
| Conflicting SDK/navigation documentation | Verify lockfile and source; obtain owner approval before migration |
| Redesign without product agreement | Approve journeys and wireframes before implementation |
| Building against assumed API routes | Verify backend handlers, DTOs and deployed behavior |
| Adding infrastructure too early | Require capacity evidence, cost and an owner |
| Offline data exposure or sync conflicts | Keep offline work gated on an approved data/sync design |
| Remote flags used as security controls | Enforce authorization on the backend |
| Force-update blocks all users | Define version compatibility and recovery behavior |
| Monitoring leaks learner data | Privacy review, redaction and retention controls |
| Large-bang release | Use vertical slices, staged rollout and rollback |

## 15. Immediate first-week checklist

Start with evidence collection, not redesign implementation:

- [ ] Confirm repository branch and working-tree state.
- [ ] Reproduce a clean dependency install.
- [ ] Run typecheck, lint, format checks and existing tests.
- [ ] Produce a development build and record failures.
- [ ] Record actual SDK, React Native, React and navigation versions.
- [ ] Inventory packages, native plugins and permissions.
- [ ] Inventory screens, routes, deep links and learner workflows.
- [ ] Map providers, state stores, API client and authentication flow.
- [ ] List every mobile API endpoint and verify it against backend source.
- [ ] Capture screenshots and screen recordings of current workflows.
- [ ] Obtain the approved design source and token export.
- [ ] Review current CI, environment configuration and release process.
- [ ] Record initial security, accessibility and performance findings.
- [ ] Create a prioritized findings register with owners.

Do not start broad visual replacement until the screen inventory, critical user journeys and design direction are approved. Fix critical security, data-integrity and build blockers immediately.

## 16. Decisions and approvals required

1. Confirm the actual supported Expo/React Native baseline from the repository and release pipeline.
2. Confirm the first-release learner workflows and excluded features.
3. Confirm supported Android and iOS versions/devices.
4. Provide the approved Figma/design-token source.
5. Confirm backend OpenAPI/DTO source and environment access.
6. Confirm tenant and organization-switching behavior.
7. Confirm expected traffic profile, SLOs, RTO and RPO.
8. Confirm analytics, crash reporting and tracing tools after privacy review.
9. Confirm feature-flag and remote configuration ownership.
10. Confirm staged rollout, mandatory update and rollback policies.
11. Confirm who owns database performance, queues, caching, CDN and infrastructure decisions.

---

## 17. Relationship to the learner development plan

This document defines how to audit and improve the existing implementation. The companion [Learner Mobile Development Plan](LEARNER_MOBILE_DEVELOPMENT_PLAN.md) defines the learner product scope, documented feature workflows, API inventory and target delivery phases.

Use both documents together:
- Audit plan: establish current state, evidence, gaps and remediation sequence.
- Development plan: preserve approved product scope and architecture constraints.
- Repository implementation and verified backend contracts: final authority for what is actually built and available.

**Operating rule:** inspect, record, agree, implement, test and measure. Do not redesign or replace a working system based only on assumptions or generic checklists.
