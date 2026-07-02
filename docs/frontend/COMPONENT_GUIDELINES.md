# Component Guidelines

## Purpose

This document defines standards for building reusable React Native components in the Skillar Mobile application.

## Principles

- Components should have a single responsibility.
- Prefer composition over inheritance.
- Keep business logic outside presentational components.
- Use strict TypeScript types.
- Reuse shared components before creating new ones.

## Component Categories

- Base UI components
- Composite components
- Feature-specific components
- Layout components

## Best Practices

- Keep props minimal and well typed.
- Support loading, error, and empty states where applicable.
- Design for accessibility.
- Avoid unnecessary re-renders.
- Document reusable components.

## File Organization

Each reusable component should include:

- Component implementation
- Types
- Tests (where applicable)
- Documentation/examples when needed

## Future Enhancements

This guide will be expanded with naming conventions, component templates, testing examples, and performance recommendations.