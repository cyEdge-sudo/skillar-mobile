# Error Handling

## Purpose

This document defines a consistent error handling strategy for the Skillar Mobile application.

## Principles

- Handle errors close to their source.
- Present user-friendly messages.
- Avoid exposing internal implementation details.
- Log unexpected failures for diagnostics.

## Error Flow

Service → Repository → Hook → Screen

Each layer should translate errors into a format appropriate for the next layer.

## Error Categories

- Network errors
- Authentication errors
- Validation errors
- Server errors
- Unknown errors

## Guidelines

- Do not swallow exceptions silently.
- Retry transient failures where appropriate.
- Display actionable feedback to users.
- Record diagnostic information without exposing sensitive data.

## Future Enhancements

This guide will be expanded with error codes, retry policies, logging integrations, and monitoring recommendations.