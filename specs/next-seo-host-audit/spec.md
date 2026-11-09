# SEO host audit

Status: In progress

## Objective

Keep the discoverability gains of `specs/next-seo-discovery` and of the demo-site baselines from decaying. Every public host of the portfolio is checked weekly against the same baseline; a regression fails a scheduled run, which notifies the owner.

## Requirements

- DISC-008: When the audit evaluates a host, it shall report a finding for each of: the page not answering HTTP 200; no single canonical equal to `https://<host>/`; a `noindex` robots meta; a description outside 70 to 200 characters or duplicated; missing Open Graph title, description, `og:url` equal to the canonical or absolute image; a missing Twitter card; missing or unparsable JSON-LD; a `robots.txt` that is missing, blocks the site or advertises no sitemap on the same host; an advertised sitemap that is neither a urlset listing the root nor a sitemap index; a missing or non-Markdown `llms.txt`.
- DISC-009: The audited hosts shall be the main site plus every `*.naindev.com` host linked from `public/assets/data/projects.json`, once each, so a new demo is covered when it enters the catalog.
- DISC-010: The workflow `seo-audit.yml` shall run weekly and on demand with read-only permissions, pinned actions and no persisted credentials, and shall fail when any host has a finding.
- DISC-011: `npm run check:seo` shall run the unit tests of the audit rules.

## Edge cases

- A sitemap answered by a single-page-application shell, or an `llms.txt` answered by it, is a finding, not a pass.
- The upper description limit is 200 characters: above 160 only risks a truncated snippet.
- Hosts outside `naindev.com` (for example the DSE product site) belong to other properties and are not audited here.

## Out of scope

- Opening issues automatically (it would need `issues: write`, which `scripts/workflows.test.mjs` CI-002 reserves for the Pages deploy job).

## Session state

- Last updated: 2026-11-10
- Done: rules, script, workflow and tests; first live run found `parametricad` and `configurator` pending their own pull requests.
- Next: owner review.
- Blocked: nothing.
