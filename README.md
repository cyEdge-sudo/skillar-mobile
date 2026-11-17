# Skillar Mobile

Cross-platform learner app for Skillar — roadmaps, learning journeys and step-wise learning content — built with Expo SDK 58 and React Native.

## Requirements

- Node.js 22
- npm 10+

## Getting started

```bash
npm ci
cp .env.example .env
```

Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to the public API origin (the app appends `/api/v1` itself).

## Run

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm start`       | Start the Expo dev server (tunnel) |
| `npm run android` | Launch on Android                  |
| `npm run ios`     | Launch on iOS                      |
| `npm run web`     | Launch on web                      |

## Project layout

```
src/
  app/         navigation and screen composition
  core/        API client, auth, config, constants
  features/    auth, dashboard, journeys, learning, profile, roadmaps
  shared/      UI components, theme system, utilities
tests/         unit tests (Node built-in test runner)
```

## Quality checks

| Command                      | Purpose                                  |
| ---------------------------- | ---------------------------------------- |
| `npm test`                   | Unit tests                               |
| `npm run typecheck`          | TypeScript, no emit                      |
| `npm run lint`               | ESLint                                   |
| `npm run format:check`       | Prettier formatting check                |
| `npm run check:architecture` | Feature boundaries and dependency cycles |

## Android release

Release builds run through Expo EAS (`eas.json`): `preview` produces an installable APK, `production` an App Bundle. Building requires the repo to be initialized with `npx eas-cli init` and the `EXPO_TOKEN` secret to be configured.
