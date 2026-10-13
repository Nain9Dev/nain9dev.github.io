# Specification: Publish GitHub Pages only from the deploy workflow

Status: Done

## Objective

Incident on 2026-10-13: `https://www.naindev.com/` answered GitHub Pages' 404 page from about 16:32 to 16:45 UTC, and from about 16:04 to 16:13 UTC. The repository's Pages source was still "Deploy from a branch" (`build_type: legacy`, `main` at `/`): on every push GitHub's own "pages build and deployment" job published the raw repository, which has no `index.html` at its root, and seconds later `deploy.yml` replaced it with the built site. When `deploy.yml` failed (the new performance budget, spec 032), the raw repository stayed published. The same race explains the short 404 seen during earlier deploys (spec 029, T03).

With the owner's permission, the Pages source was switched to GitHub Actions the same day.

## Functional requirements (EARS)

- **DEP-003**: When a commit is pushed, only `deploy.yml` shall publish the site; a failed build shall leave the previous deployment online.

## Verification

- `gh api repos/Nain9Dev/nain9dev.github.io/pages` returns `build_type: workflow`, `cname: www.naindev.com` (2026-10-13, after the change).
- The re-run of deploy run 38431311526 (commit 47d4c22) passed the budget and published; the home page answered 200 afterwards.
- Next push: no "pages build and deployment" run is expected.

## Session state

- Last updated: 2026-10-13, incident session
- Done: source switched, service restored, documented.
- Verified: the pushes of 8af159a, cdee780 and a6239a3 triggered only "Deploy Astro site to GitHub Pages"; the home page answered 200 on every check during those deploys, including the blocked deploy of cdee780.
- Next: none.
- Blocked: —
