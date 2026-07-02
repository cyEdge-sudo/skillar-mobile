# Build & Release Guidelines

## Purpose

This document defines the build, versioning, release, and deployment process for the Skillar Mobile application to ensure repeatable, reliable, and secure deliveries.

---

## Build Strategy

- Use Expo Application Services (EAS) Build for production builds.
- Maintain separate build profiles for development, preview, and production.
- Ensure all builds are reproducible and automated.

---

## Environment Management

- Keep environment-specific configuration outside source code.
- Use secure environment variables for secrets.
- Validate required variables during CI.

---

## Versioning

- Follow Semantic Versioning (SemVer).
- Increment Android versionCode and iOS buildNumber with every release.
- Maintain a clear CHANGELOG.

---

## Continuous Integration

Every commit to the main development branch should:

- Pass TypeScript compilation.
- Pass ESLint.
- Pass automated tests.
- Produce a successful build.

---

## Release Process

1. Verify Definition of Done.
2. Run full CI pipeline.
3. Generate production build.
4. Execute smoke testing.
5. Publish through approved release channels.
6. Monitor post-release health.

---

## Rollback Strategy

- Maintain the ability to redeploy the previous stable release.
- Use EAS Update rollbacks where applicable.
- Document release incidents and remediation.

---

## Release Checklist

Before release:

- All tests pass.
- No critical security findings.
- Documentation updated.
- Version numbers updated.
- Release notes prepared.

---

## Anti-Patterns

Avoid:

- Manual production builds.
- Releasing without CI validation.
- Hardcoded environment values.
- Skipping release verification.

---

## Related Documents

- SECURITY.md
- TESTING_STRATEGY.md
- PERFORMANCE.md
- DEFINITION_OF_DONE.md