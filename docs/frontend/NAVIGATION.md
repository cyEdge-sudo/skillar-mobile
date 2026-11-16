# Navigation

## Navigation library

The app uses React Navigation 7. It does not use Expo Router.

## Root navigation

The root navigator selects one of the following states based on the authentication provider:

- Restoring session
- Authentication stack
- Learner tab navigation

## Authentication stack

- Login
- Sign up
- Forgot password

## Learner tabs

- Dashboard
- Explore
- My Learning
- Profile

## Rules

- Define parameter lists in `src/app/navigation/navigation-types.ts`.
- Use typed navigation props.
- Keep route names in `NAVIGATION_ROUTES` in the shared constants file.
- Pass only IDs and small presentation parameters between screens. Fetch resource data through feature services.
- Do not add admin, tenant-management or organization-management routes to the mobile app.
- Keep deep-linking support in mind when choosing route names and parameters.

## Session protection

The root navigator renders learner tabs only when the auth provider reports an authenticated session. The backend must still authorize every protected API request.
