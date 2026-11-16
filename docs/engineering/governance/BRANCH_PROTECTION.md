# Main Branch Protection

## Current status

Verified on 16 November 2026:

- GitHub reports `main.protected = false`.
- The repository rulesets endpoint returned an empty list.
- Therefore, `main` is currently **not protected**.

The connected GitHub integration can read the branch protection flag and repository ruleset list. It cannot read detailed classic protection settings (the protection endpoint returns HTTP 403), and it does not expose a branch-protection or ruleset write action. A repository owner must apply the rule in GitHub Settings.

## Apply the protection rule

Open:

[Repository branch settings](https://github.com/cyEdge-sudo/skillar-mobile/settings/branches)

Create a branch protection rule or repository ruleset that targets the exact branch name:

`main`

Enable:

1. Require a pull request before merging.
2. Require conversation resolution before merging.
3. Require status checks to pass before merging.
4. Require branches to be up to date before merging.
5. Block force pushes.
6. Block branch deletion.
7. Dismiss stale approvals when new commits are pushed.
8. Require at least one approval if another trusted reviewer is available.

For a single-maintainer repository, do not require an approval that nobody else can provide. Keep the pull request and status-check requirements enabled. Apply the rule to administrators too, where practical.

## Required status check

The CI workflow is `.github/workflows/mobile-ci.yml`.

After a successful workflow run, select this exact job check:

`Typecheck and lint`

It runs:

- `npm ci`
- `npm run typecheck`
- `npm run lint`

Do not require `format:check` until it is included in CI and the whole repository has been normalized with Prettier.

## Working agreement

- All application work happens on feature or fix branches.
- Pull requests target `main`.
- Do not push feature commits directly to `main`.
- Keep `main` in a releasable state.
- Delete short-lived branches after their pull requests are merged.
