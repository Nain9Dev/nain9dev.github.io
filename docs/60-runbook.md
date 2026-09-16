# Runbook

Status: Draft

Detailed translation workflow: [06-runbook/english-localization.md](06-runbook/english-localization.md).

## Start

Prerequisites: Node.js 24 or later (`package.json` `engines`), npm.

```sh
npm ci
npm run dev        # Spanish authoring server (Astro dev)
npm run check      # unit tests, astro check, full bilingual build, icon/SEO/locale contracts
npm run preview    # serve dist/ including English pages under /en/
```

- `astro dev` renders Spanish only. English pages exist only after `npm run build`, because `scripts/build-locales.mjs` runs after `astro build`.
- The repository's agent instructions start the dev server with `astro dev --background` and manage it with `astro dev stop|status|logs`.
- Regenerate brand icons only after changing the SVG mark: `npm run generate:brand-icons`, then `npm run check`.
- Translation drafts, review and acceptance: see the localization runbook linked above.

## Environments

| Environment | Trigger | What runs | Result |
| :--- | :--- | :--- | :--- |
| Local | manual | `npm run check`, `npm run preview` | `dist/` |
| Pull request | `pull_request` | `static-site-check.yml`: `npm ci`, `npm run check`, read-only permissions, no secrets | Status check only |
| Production | push to `main` or `workflow_dispatch` | `deploy.yml`: `npm run check`, upload `dist/`, deploy to GitHub Pages (`github-pages` environment), Cloudflare cache purge | https://www.naindev.com |

`static-site-check.yml` also runs on push to `main`, in parallel with `deploy.yml`.

## Release

1. Obtain explicit owner authorization for the commit and push scope.
2. Run `npm run check` locally.
3. Push to `main`; confirm both workflows succeed for that commit.
4. Run `node scripts/check-production.mjs` (read-only GET requests; compares production with the local `dist/`; writes evidence to the git-ignored `.astro/production-verification.json`). Requires a current local bilingual build of the same commit.
5. Record commit SHA, run IDs and verification outcome in the active spec handoff.

## Recovery

- **CI failure**: read the failing step in the Actions log. Contract scripts print every violation before failing (`check-seo.mjs`, `check-locales.mjs`). A missing or draft translation fails the build by design; fix the source/catalog pair, never mark a draft as reviewed to pass CI.
- **Bad release**: revert the offending commit on `main` through the normal authorized workflow; the deploy workflow republishes the previous content. Then rerun `check-production.mjs`. No database or migration is involved.
- **Stale content at the edge**: the purge step depends on `CLOUDFLARE_ZONE` and `CLOUDFLARE_API_TOKEN`, which are not listed as repository secrets (B-003). Purge manually in the Cloudflare dashboard until that is resolved.
- **Stale favicon**: keep the stable URLs; `/favicon.ico` may stay cached by intermediaries. Compare public and local hashes before changing anything (spec 002 `verification.md`).
- **Leaked secret**: follow `SECURITY_POLICY.md` section 3 and revoke the credential at the provider first.

### Pre-redesign snapshot

Branch `naindev/legacy` (commit `77317aa`, created 2026-09-16) preserves the site
as published before case study removal and the redesign, for before/after
comparison and recovery. Only the repository admin can update it (ruleset
`protect-non-design-branches`). To inspect or rebuild it locally:

```bash
git switch naindev/legacy
npm ci && npm run build
```

## Known limits

- Newsletter form uses placeholder MailerLite identifiers; subscriptions are not delivered (B-007).
- Cloudflare cache purge is unverified and probably ineffective (B-003).
- `public/_headers` is not processed by GitHub Pages; whether Cloudflare applies equivalent headers is unverified (B-004). The CSP is delivered as a meta tag.
- Automated checks prove structural consistency of translations, not semantic fidelity (spec 003).
- A passing build does not prove search ranking, Google's chosen favicon or site name, or field Core Web Vitals (specs 002, 003).
- The PageSpeed Insights API returned HTTP 429 during spec 002 verification; no performance score is recorded.
- Several homepage claims await owner evidence (`11-open-questions.md`).
