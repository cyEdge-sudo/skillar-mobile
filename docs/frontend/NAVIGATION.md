# Navigation

## Purpose

This document defines navigation standards for the Skillar Mobile application using Expo Router.

## Principles

- Use file-based routing with Expo Router.
- Keep navigation configuration declarative.
- Separate navigation from business logic.
- Protect authenticated routes.

## Route Organization

- Group routes by feature where appropriate.
- Use layouts to share navigation structure.
- Keep route names predictable and consistent.

## Navigation Rules

- Pass only required route parameters.
- Avoid deeply nested navigation.
- Prefer typed navigation parameters.
- Handle unknown routes gracefully.

## Deep Linking

Design routes to support future deep linking and app links without major structural changes.

## Future Enhancements

This guide will be expanded with route diagrams, authentication flows, navigation guards, and deep-linking examples.