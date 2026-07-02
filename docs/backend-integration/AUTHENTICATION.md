# Authentication

## Purpose

This document defines the authentication architecture for the Skillar Mobile application.

## Principles

- Authenticate all protected API requests.
- Store tokens securely using platform secure storage.
- Never hardcode credentials or secrets.
- Refresh expired tokens automatically when supported.

## Authentication Flow

1. User signs in.
2. Backend returns authentication tokens.
3. Tokens are stored securely.
4. Protected requests include the access token.
5. Expired tokens are refreshed or the user is re-authenticated.

## Security

- Validate authentication state before accessing protected resources.
- Clear tokens during logout.
- Prevent unauthorized access to cached protected data.

## Future Enhancements

This guide will be expanded with OAuth flows, biometric authentication, session management, and token refresh strategies.