# Expo Guidelines

## Purpose

This document defines the Expo-specific engineering standards for the Skillar Mobile application. It ensures consistent use of Expo SDK features, Expo Router, EAS Build, and platform integrations.

---

## Supported Platform

- Primary target: Android
- Secondary target: iOS
- Development: Expo Go where supported
- Production builds: EAS Build

---

## Project Configuration

- Maintain configuration in `app.json` or `app.config.ts`.
- Keep environment-specific values outside source code.
- Do not hardcode secrets.

---

## Expo Router

- Use file-based routing.
- Avoid imperative navigation where declarative routing is available.
- Keep route groups organized by feature.

---

## Native Modules

- Prefer Expo SDK modules before third-party native libraries.
- Verify Expo SDK compatibility before introducing new dependencies.
- Document any required config plugins.

---

## Permissions

- Request permissions only when needed.
- Explain why permissions are required.
- Gracefully handle denied permissions.

---

## Updates

- Use EAS Update for over-the-air updates where appropriate.
- Validate backward compatibility before publishing updates.

---

## Assets

- Optimize images and fonts.
- Use vector assets where practical.
- Avoid bundling unused assets.

---

## Performance

- Lazy-load screens where appropriate.
- Avoid unnecessary native bridge calls.
- Profile startup performance regularly.

---

## Anti-Patterns

Avoid:

- Unsupported native modules
- Hardcoded environment values
- Excessive config plugins
- Platform-specific code without abstraction

---

## Related Documents

- REACT_GUIDELINES.md
- BUILD_RELEASE.md
- PERFORMANCE.md
- CLEAN_ARCHITECTURE.md