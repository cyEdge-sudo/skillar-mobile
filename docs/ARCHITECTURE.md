# Skillar Mobile Architecture

> Living architecture document.

## Vision
A production-grade Expo SDK 54 application using React 19, React Native 0.81, Expo Router, TypeScript, Clean Architecture, and feature-first modularization.

## Guiding Principles
- Clean Architecture
- SOLID
- Feature-first organization
- API-first design
- Offline-capable
- Secure-by-default
- Testability
- Accessibility
- Reusable design system

## Layers
1. Presentation
2. Application (hooks/use-cases)
3. Domain (entities/interfaces)
4. Data (repositories/services)
5. Infrastructure (HTTP, storage, auth)

Dependencies flow inward only.

## Folder Structure
```
app/
src/
  features/
  components/
  services/
  repositories/
  domain/
  hooks/
  store/
  theme/
  navigation/
  utils/
  types/
  constants/
  assets/
```

## State Management
- Local state by default
- Context for app-wide concerns
- Repository pattern for server communication
- Server state abstraction to be finalized during implementation

## Networking
- Central API client
- Request/response interceptors
- Token refresh
- Retry policy
- Typed DTOs

## Authentication
- SecureStore for credentials
- Refresh token flow
- Protected routes
- Session restoration

## Offline Strategy
- Download manager
- Local persistence
- Sync queue
- Conflict handling

## Design System
- Tokens
- Atomic reusable components
- Theme provider
- Dark mode ready

## Quality
- Strict TypeScript
- ESLint
- Prettier
- Unit tests
- Integration tests

## Future Documents
- API Architecture
- State Management
- Navigation
- Design System
- Security
- Offline Sync
- Testing Strategy
- CI/CD
