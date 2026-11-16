# Protecting the main branch

Configure this rule in GitHub repository settings for the `main` branch.

## Recommended rules

- Require a pull request before merging.
- Require at least one approval before merging. If the repository has only one active maintainer, use a second trusted reviewer or adjust the approval requirement so work is not blocked.
- Dismiss stale approvals when new commits are pushed.
- Require approval of the most recent reviewable push.
- Require status checks to pass before merging:
  - `validate` (once the CI workflow has run and GitHub offers this check).
- Require branches to be up to date before merging.
- Require conversation resolution before merging.
- Block force pushes.
- Block branch deletion.
- Do not allow bypassing the rule for routine development.
- Keep administrators subject to the rule where practical.

## GitHub UI steps

1. Open **Settings → Rules → Rulesets** (or **Settings → Branches** for classic branch protection).
2. Create a branch ruleset and target the branch name pattern `main`.
3. Enable the rules above.
4. Save the ruleset.
5. Open **Settings → Rules → Rulesets** and confirm that the ruleset is active and targets `main`.

The GitHub integration used for this repository can read repository metadata and create branches and pull requests, but it does not have permission to read or write branch protection settings. Therefore, a repository owner must apply the settings in GitHub.

## Merge policy

All application changes should enter `main` through reviewed pull requests. Use squash merging unless the team has a reason to preserve individual commits. Keep feature branches short-lived and delete them after merge.
