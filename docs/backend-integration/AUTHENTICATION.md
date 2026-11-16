# Authentication

## Session contract

The app uses access and refresh tokens issued by `skiller-backend`. See [API Contract](./API_CONTRACT.md) for the request and response schemas.

## Rules

- All tokens are stored together in Expo SecureStore.
- Do not store credentials in AsyncStorage, navigation state, query cache or logs.
- The access token is sent as a Bearer token on protected requests.
- Refresh tokens are sent only to the refresh and logout endpoints.
- The backend rotates refresh tokens and revokes the prior refresh token.
- A refresh attempt is single-flight. Concurrent expired requests share the same refresh operation.
- A rejected refresh session clears local tokens and returns the app to the unauthenticated state.
- Network failures do not delete a potentially valid session.
- Logout clears local tokens even when the server cannot be reached.

## Runtime flow

1. On launch, read the token pair from SecureStore.
2. If no token pair exists, show the authentication stack.
3. If tokens exist, call `GET /me`.
4. If the access token is expired, the API client attempts one refresh and retries the original request once.
5. If refresh is rejected, clear tokens and show the authentication stack.
6. If the backend cannot be reached, show a retry state. Do not assume the user is authenticated based only on locally stored tokens.

## Google authentication

The mobile app sends a Google ID token to the backend. The backend validates its signature and audience. No client secret or backend credential is included in the app bundle.

## Session lifetime

Token expiry timestamps and rotation behavior are owned by the backend. Mobile must not extend token expiry locally.

## Implementation

- `src/core/auth/token-storage.ts`: SecureStore persistence.
- `src/core/auth/auth-service.ts`: authentication requests.
- `src/core/auth/auth-context.tsx`: app session state.
- `src/core/auth/validators.ts`: runtime parsing of auth payloads.
- `src/core/api/api-client.ts`: access token, refresh coordination and retry behavior.
