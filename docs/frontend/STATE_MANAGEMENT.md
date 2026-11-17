# State Management

## State ownership

Use the smallest state mechanism that fits the data.

| State                     | Owner                            | Examples                                                        |
| ------------------------- | -------------------------------- | --------------------------------------------------------------- |
| Screen-local state        | React state                      | Form values, modal visibility, selected tab within a screen     |
| Server state              | TanStack Query                   | Roadmaps, enrollments, lesson content, assessments and progress |
| Authentication session    | Auth Context                     | Session status and current learner                              |
| Sensitive persisted state | Expo SecureStore                 | Access and refresh token pair                                   |
| Non-sensitive preferences | AsyncStorage, only when required | User-selected preferences                                       |

## Rules

1. Prefer local component state. Do not create global state for values used by one screen.
2. TanStack Query is the owner of server state. Use query keys from `QUERY_KEYS`.
3. Do not copy API response objects into Context or another global store.
4. Auth Context stores only the current learner identity, authentication status and authentication actions.
5. Keep access and refresh tokens in SecureStore. Never put them in AsyncStorage, query cache, navigation parameters or logs.
6. Use AsyncStorage only for non-sensitive preferences or small non-sensitive local values.
7. Derive values from existing state instead of storing duplicate values.
8. Invalidate or update the relevant TanStack Query cache after successful mutations.
9. Clear protected query data on logout and when the refresh session is rejected.

## Query defaults

The shared QueryClient is configured in `src/app/providers/app-providers.tsx`. Keep global defaults conservative. Feature-specific query freshness, pagination and retry behavior belong with the feature query.

Do not retry mutations automatically unless the operation is idempotent and has an idempotency key.

## Adding another state library

Do not add Zustand or another global store by default. Add one only when a concrete cross-feature client-state requirement cannot be handled cleanly by local state or the existing Auth Context. Record the decision and keep server state in TanStack Query.
