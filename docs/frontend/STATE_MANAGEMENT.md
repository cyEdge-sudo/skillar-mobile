# State Management

## Purpose

This document defines the state management strategy for the Skillar Mobile application.

## Principles

- Prefer local state where possible.
- Use Context only for shared application state.
- Keep business logic outside UI components.
- Minimize unnecessary global state.

## State Categories

- Local component state
- Shared application state
- Server state
- Derived state

## Guidelines

- Keep state close to where it is used.
- Avoid duplicating state.
- Use immutable update patterns.
- Separate UI state from domain state.

## Future Enhancements

This guide will be expanded with examples, provider architecture, caching strategy, and server-state management recommendations.