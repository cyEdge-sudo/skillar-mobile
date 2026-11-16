# API Architecture

## Purpose

This document defines how the learner app integrates with `skiller-backend`.

## Principles

- Mobile calls only the NestJS backend API.
- All routes use the `/api/v1` prefix.
- UI components never call `fetch` or know endpoint paths.
- Endpoint paths, headers and query keys are defined in `src/core/constants/app.constants.ts`.
- Feature services own request/response mapping.
- The shared API client handles headers, request IDs, timeouts, cancellation, errors and token refresh.
- API responses are `unknown` until a runtime parser validates them.
- Do not use explicit `any`.

## Request flow

Screen → Feature service/hook → API client → NestJS API → backend service → database.

## Response contract

Success responses use `{ data, meta }`. Errors use `{ error, meta }`. See [API Contract](./API_CONTRACT.md) for endpoint and schema details.

## Server state

Use TanStack Query for API data, cache invalidation and loading/error state. Do not mirror API responses into auth context or unrelated global state.

## Mutations

Use idempotency keys for operations that create enrollments or submit assessments. Invalidate the relevant query keys after a successful mutation.

## Contract governance

The backend will publish an OpenAPI specification. Keep the mobile contract, runtime parsers and backend DTOs aligned.
