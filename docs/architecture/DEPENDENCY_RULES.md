# Dependency Rules

This document defines architectural dependency rules for the Skillar Mobile application.

## Core Rule

Dependencies always point inward toward the Domain layer.

## Layer Rules

- Presentation may depend on Application and shared modules.
- Application may depend on Domain.
- Domain must not depend on any framework.
- Data may depend on Domain and Infrastructure.
- Infrastructure may depend on platform APIs and external libraries.

## Feature Rules

- Features may use shared modules.
- Features must not import internal code from other features.
- Shared modules must remain feature agnostic.

## General Rules

- No circular dependencies.
- Prefer interfaces over implementations.
- Business logic stays outside UI components.
- External libraries should be evaluated before adoption.
- Significant dependency changes require an ADR.
