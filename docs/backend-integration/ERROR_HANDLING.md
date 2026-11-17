# Error Handling

## Error envelope

The backend returns the standard error response defined in [API Contract](./API_CONTRACT.md):

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": []
  },
  "meta": {
    "requestId": "request-id"
  }
}
```

## Client behavior

| Condition           | Client behavior                                                        |
| ------------------- | ---------------------------------------------------------------------- |
| Network unavailable | Show a connection message and retry action                             |
| Request timeout     | Allow retry                                                            |
| Request cancelled   | Do not show as a server failure                                        |
| 400 / 422           | Show safe validation message or field details                          |
| 401                 | Attempt one token refresh for protected calls                          |
| 403                 | Show access denied; clear session only when refresh itself is rejected |
| 404                 | Show resource unavailable                                              |
| 409                 | Explain that the requested operation conflicts with current state      |
| 429                 | Respect `Retry-After` when supplied                                    |
| 5xx                 | Show service unavailable and allow retry                               |

## Rules

- Do not parse server message text to determine behavior. Use HTTP status and stable error codes.
- Do not expose stack traces or internal backend messages.
- Do not retry mutations automatically unless the operation is idempotent.
- Use idempotency keys for enrollment creation and assessment submission.
- Keep diagnostic request IDs available for support, but never log passwords or tokens.
- Treat response JSON as `unknown` until it passes a runtime parser.
- Use the shared `ApiError` type for transport and backend failures.

## Implementation

- `src/core/api/api-client.ts`: transport and response parsing.
- `src/core/api/api-error.ts`: normalized API error.
- `src/core/constants/app.constants.ts`: stable error codes and user-facing messages.
