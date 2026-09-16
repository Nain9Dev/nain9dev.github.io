# Design Collaboration Plan

## Access model

- David stays a collaborator with the `write` role.
- One repository ruleset protects every branch except `design/**`:

| Field | Value |
| :--- | :--- |
| Name | `protect-non-design-branches` |
| Enforcement | Active |
| Target | Include all branches; exclude `refs/heads/design/**` |
| Rules | Restrict creations, restrict updates, restrict deletions, block force pushes |
| Bypass | Repository admin role, always |

Aitor (admin) bypasses the ruleset and keeps pushing to `main`. `GITHUB_TOKEN`
and David do not bypass it, so a workflow added in a design branch cannot push
to `main` either.

Equivalent API call (definition in `ruleset.json` is kept outside the repo):

```bash
gh api -X POST repos/Nain9Dev/nain9dev.github.io/rulesets --input ruleset.json
```

## Deployment boundary

- `deploy.yml` runs on `push` to `main` only.
- The `github-pages` environment allows deployments from `main` only, so a
  workflow defined in a design branch cannot publish the site (DES-006).
- Default workflow token permissions are read-only.
- `static-site-check.yml` runs on pull requests from design branches; it has
  read-only permissions and no secrets.

## Design workspace

- `design/README.md` on `main` is the brief; every `design/*` branch inherits it.
- Proposals live in `design/<topic>/` as self-contained HTML/CSS, assets and
  exports. The Astro build ignores the folder because it is outside `src/` and
  `public/`.

## Verification

1. `gh api repos/Nain9Dev/nain9dev.github.io/rulesets` lists the active ruleset.
2. As `davidesuarez`: push `design/access-check` succeeds.
3. As `davidesuarez`: push to `main` and create `feature/x` are rejected.
4. As `Nain9Dev`: push to `main` still succeeds.
