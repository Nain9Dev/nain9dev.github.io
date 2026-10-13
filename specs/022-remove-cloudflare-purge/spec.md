# Specification: Remove the Cloudflare cache purge step

Status: Done

## Objective

The "Purge Cloudflare Cache" step in `deploy.yml` has never worked: on 2026-10-13 (deploy run 38383097119) the Cloudflare API answered `success: false` with error 7003 (invalid object identifier), and the step still passed because `curl` has no `--fail`. Since spec 020, Cloudflare caches only content-hashed `/_astro/` files (B-016) and serves HTML as `DYNAMIC`, so a deploy never needs a purge. On 2026-10-13 the owner chose to remove the step instead of repairing its secrets.

## Functional requirements (EARS)

- **DEP-001**: When the site is deployed, the workflow shall not call the Cloudflare API nor reference Cloudflare secrets.
- **DEP-002**: When a deploy publishes new HTML, visitors shall receive it without a manual purge, because HTML is not cached at the edge and every client asset changes name when its content changes.

## Edge cases and error handling

- If a future Cache Rule starts caching HTML or `public/` files at the edge, a purge (or shorter TTL) becomes necessary again; that change needs its own spec.

## Out of scope

- Deleting the `CLOUDFLARE_ZONE` and `CLOUDFLARE_API_TOKEN` secrets from GitHub (owner action; `gh secret list` returned none on 2026-09-16).

## Acceptance criteria

- `scripts/deploy-workflow.test.mjs` passes inside `npm run check`.
- `actionlint` and `zizmor` report no new findings on `.github/workflows/deploy.yml`.
- After the next deploy, the home page HTML served in production references the new bundle hashes.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01 to T03.
- Next: none.
- Blocked: —
