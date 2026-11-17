# Skillar Mobile Roadmap

## Vision

Build a secure, maintainable learner application for Skillar using Expo, React Native and TypeScript.

## Phase 0 – Foundation

- Confirm mobile/backend API contract.
- Standardize app constants and typing rules.
- Establish feature-first source structure.
- Configure providers, navigation and theme.
- Establish API client and secure token storage.
- Add repository documentation and CI checks.

Exit criteria:

- App starts on Android and iOS.
- Strict TypeScript and lint checks pass.
- No feature screen calls the backend directly.

## Phase 1 – Account and learner shell

- Login
- Signup and verification
- Password reset
- Session restoration and logout
- Learner dashboard shell
- Profile shell

Exit criteria:

- Authentication follows the agreed backend contract.
- Tokens are stored only in SecureStore.
- Expired sessions are refreshed or cleared safely.

## Phase 2 – Roadmap learning

- Browse/search roadmaps
- Roadmap details
- Enrollments
- Milestone and step navigation
- Lesson content
- Quiz and assessment attempts
- Progress tracking

Exit criteria:

- Learners can complete a roadmap flow.
- Progress persists through backend APIs.
- Loading, empty, error and retry states are handled.

## Phase 3 – Journeys and supporting capabilities

Journeys are a separate product concept from roadmaps. Add them only after their mobile/API contracts are defined.

Potential learner capabilities:

- Skill development journeys
- Compliance journeys
- Governance journeys
- Onboarding journeys
- Notifications
- Offline downloads, if sync rules are defined

## Phase 4 – Production readiness

- Automated unit and integration tests
- End-to-end testing on Android and iOS
- Accessibility review
- Performance profiling
- Security review
- EAS build and release workflow

## Scope rules

- No admin or organization-management screens in this app.
- Do not build mock API responses into production services.
- Do not implement offline features without an explicit sync design.
- Backend APIs remain the source of truth for learner state.
