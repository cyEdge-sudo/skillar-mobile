# Data Flow

## Purpose

This document describes how data moves through the Skillar Mobile application.

## Request Flow

User Action → Screen → Hook → Repository → Service → API

The response follows the reverse path back to the UI.

## Principles

- UI never calls HTTP clients directly.
- Repositories abstract data sources.
- Services interact with platform APIs and backend APIs.
- Domain models isolate business logic from transport models.

## Offline Flow

1. Read local cache when available.
2. Fetch latest data from the server.
3. Persist updated data locally.
4. Refresh the UI.

Pending user actions should be queued and synchronized when connectivity is restored.

## Error Flow

Errors should be translated into user-friendly messages before reaching the presentation layer. Logging should occur within infrastructure or service layers rather than UI components.

## Future Enhancements

This document will be expanded with sequence diagrams, cache invalidation rules, synchronization workflows, and state transition diagrams as the architecture evolves.