# Build, CI/CD, and Releases

The project uses GitHub Actions to automate CI and releases, adhering strictly
to Semantic Versioning and Conventional Commits.

- **Node Version**: v24 (using `node:24-bookworm` containers).

## CI / PR Verification

- **Build & Test (`ci.yml`)**: On any PR to `main`, the CI installs
  dependencies, builds the TypeScript representation (`yarn build`), and runs
  tests (`yarn test`).
- **Semantic Commits (`pr.yml`)**: PRs are validated to ensure PR titles and
  commits follow the Conventional Commits specification. This step is critical
  because the automated repository release process relies on semantic
  versioning.
- **Agent Rule**: Adhere strictly to **Conventional Commits** (e.g., `feat:`,
  `fix:`, `chore:`) when proposing or creating git commits.

## Automated Release Workflow

- **Release Please (`release.yml`)**: When changes merge into `main`, Google's
  `release-please-action` checks the semantic commit history to automatically
  generate and maintain a Release PR (which updates `CHANGELOG.md` and bumps
  versions).
- **NPM Publishing**: When the automated Release PR is merged, a dependent
  GitHub Actions job builds the package and publishes it directly to NPM
  (`yarn npm publish`) using secure OIDC Trusted Publishing.
