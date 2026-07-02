# API Architecture

## Purpose

This document defines the backend integration architecture for the Skillar Mobile application.

## Principles

- UI components must never call APIs directly.
- All backend communication flows through the service and repository layers.
- DTOs should be mapped to domain models.
- Network concerns remain isolated from business logic.

## Request Flow

Screen → Hook → Repository → Service → REST API

Responses follow the reverse path after validation and mapping.

## Error Handling

Repositories should normalize API errors before exposing them to the presentation layer.

## Future Enhancements

This guide will be expanded with endpoint conventions, versioning strategy, retry policies, and integration examples.