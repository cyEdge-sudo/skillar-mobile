# Security Practices

## Purpose

This document defines the secure engineering practices for the Skillar Mobile application. Security is a cross-cutting concern and must be considered during design, implementation, testing, deployment, and maintenance.

---

## Core Principles

- Security by default.
- Least privilege.
- Defense in depth.
- Fail securely.
- Never trust external input.

---

## Authentication & Authorization

- Use OAuth/JWT flows defined by the backend.
- Store access and refresh tokens using Expo SecureStore.
- Never persist sensitive credentials in AsyncStorage.
- Enforce role- and permission-based access provided by the API.

---

## Secrets Management

- Never hardcode API keys, tokens, or credentials.
- Inject environment-specific values at build time.
- Exclude secrets from source control.

---

## Input Validation

- Validate all user input.
- Validate API responses before use.
- Sanitize values used in logging and UI where appropriate.

---

## Secure Networking

- Communicate only over HTTPS.
- Validate TLS certificates.
- Configure request timeouts.
- Handle authentication failures consistently.

---

## Secure Storage

- Store sensitive values in Expo SecureStore.
- Encrypt data where platform support requires it.
- Remove credentials on logout.

---

## Logging

- Never log tokens, passwords, PII, or secrets.
- Log only information required for troubleshooting.
- Differentiate debug and production logging.

---

## Dependency Security

- Keep dependencies up to date.
- Remove unused packages.
- Review third-party libraries before adoption.
- Monitor for known vulnerabilities.

---

## Code Review Checklist

Verify:
- No hardcoded secrets.
- Input validation exists.
- Proper authorization checks.
- Secure storage usage.
- Safe logging.

---

## Anti-Patterns

Avoid:

- Secrets in source code
- Sensitive data in logs
- Trusting client-side validation alone
- Using insecure storage for credentials

---

## Related Documents

- security-best-practices.md
- AI_DEVELOPMENT_GUIDELINES.md
- BUILD_RELEASE.md
- DEPENDENCY_POLICY.md