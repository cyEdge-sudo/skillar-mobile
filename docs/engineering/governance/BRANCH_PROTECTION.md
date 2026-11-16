# Main Branch Protection

## Required target

Protect the `main` branch in GitHub repository settings.

The connected GitHub integration used for this implementation can read repository metadata but does not have access to change branch-protection settings. This policy is therefore documented here for a repository administrator to apply in GitHub.

## GitHub settings

Open:

`Settings → Branches → Add branch protection rule`

Set the branch name pattern to:

`main`

Enable:

1. Require a pull request before merging.
2. Require conversation resolution before merging.
3. Require status checks to pass before merging, after the CI workflow has produced stable check names.
4. Block force pushes.
5. Block branch deletion.
6. Require linear history if the repository adopts squash/rebase-only merges.

For teams with more than one reviewer, require at least one approving review and dismiss stale approvals when new commits are pushed. For a single-maintainer repository, do not require an approval that nobody else can provide; keep the PR requirement and status checks enabled.

## Status checks

The mobile CI workflow should validate:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run format:check` once repository formatting has been normalized

Only mark checks as required after a successful run has registered in GitHub.

## Working agreement

- All implementation work happens on feature or fix branches.
- Pull requests target `main`.
- No direct feature commits to `main`.
- Keep `main` deployable.
