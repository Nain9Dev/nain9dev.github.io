# Specification: Verifiable receipts band in the hero

Status: Draft (branch `feat/receipts-strip`, worktree `D:/wt/nain9dev.github.io-feat-receipts-strip`, from `origin/main` `a960a51`)

## Objective

Give the first screen of the home a short band of receipts a visitor can check with one click, instead of asking them to trust adjectives: the site's own source code, the checks that run on every change, the commit that produced the page they are reading and the public status monitor of the services. The owner set this aside on 2026-10-27 (spec 049, decision 1) in favour of the selected work; the selected work and the work pages exist now (specs 049 and 050), so the band proves the craft behind them. It replaces nothing: the old `ProofStrip` of three generic sentences left the home under HN-005 and its sentences stay in the about section.

The band is honest by construction. Every value is a fact of this repository or a link to a page where the fact is read, never a score, a count or a promise written by hand. The publication receipt is taken from the commit being built, so it is correct on every deploy without anyone editing it.

## Functional requirements (EARS)

### Content

- **RC-001 (band)**: When the home renders, the hero section shall end, after the hero grid, with a list `ul.receipts` named "Comprobable" (visible lead) that holds exactly four receipts in this order: the site source (`https://github.com/Nain9Dev/nain9dev.github.io`), the checks on every change (`https://github.com/Nain9Dev/nain9dev.github.io/actions`), the last publication (the commit page of the commit being built) and the service status (`https://status.naindev.com/`). Each receipt is one link with `target="_blank"` and `rel="noopener noreferrer"` that holds a label (`.receipt-label`) and a value (`.receipt-value`). The band lives inside `Hero.astro`, so the section list of HN-001 and the hero reading order of the existing guards (eyebrow, H1, offer row, buttons, summary, availability) do not change.
- **RC-002 (publication receipt)**: When the site is built, the publication value shall render the short commit identifier (seven hexadecimal characters, in `<code translate="no">`) and the commit date as an ISO date (`<time datetime="YYYY-MM-DD" translate="no">`), taken by `src/utils/build-info.ts` from `GITHUB_SHA` when the build runs in GitHub Actions and from `git rev-parse HEAD` otherwise, with the date from `git show -s --format=%cs <sha>`. The link points to `https://github.com/Nain9Dev/nain9dev.github.io/commit/<full sha>`. A build that cannot resolve a commit fails with an error that names the receipt. The Spanish and the English documents show the same value.
- **RC-003 (facts only)**: Every receipt value shall be a repository name, a host name, a commit identifier with its date or a short description of what the linked page shows; no Lighthouse score, test count, uptime percentage, duration or figure is printed, and the texts hold no "zero downtime" or guarantee. `npm run check:claims` passes.
- **RC-004 (no third parties)**: When the home is served, the band shall load no image, script, font or request from another host: no status badge image, no fetch. The only external touch points are the four links the visitor chooses to follow. The footer promise "Sin dependencias de terceros que rastreen datos personales" holds.

### Presentation

- **RC-005 (styles)**: The band's rules live in `src/styles/main.css` next to the hero rules, use only design tokens (no colour literal, no `transition: all`), keep every link at least 44 px tall, wrap the receipts on narrow screens and render the labels in the mono eyebrow style and the values in the body text colour with the link colour on hover and focus. `gzip(index.html)` stays at or under 30 720 B (CSS-002, ADR-0013), measured in `tasks.md`.
- **RC-006 (English)**: Every new Spanish string (lead, four labels, three description values) has a reviewed English target in `src/i18n/en-US.json`; `npm run check:locales` passes and the English home shows the four receipts with the same links and the same publication value.
- **RC-007 (accessibility)**: axe-core reports no violation on `/` and `/en/` at 1440 and 390 px in both themes; the list is named, the reading order is label then value, focus is visible on each link (global `:focus-visible` rule) and the band is static HTML (no script).

### Guards and approval

- **RC-008 (guard)**: `scripts/receipts-strip.test.mjs`, registered in `npm run check`, asserts RC-001 to RC-005 from the sources (and the built value when `dist/` exists) and that `src/utils/build-info.ts` resolves a seven-character identifier and an ISO date in this repository.
- **RC-009 (owner approval)**: The owner approves the wording of the lead, the labels and the three description values in the pull request and merges it; the pull request carries captures in both themes and on a phone, the document size, the axe result and the `npm run check` result.

## Edge cases and error handling

- Build outside a git checkout (a plain export of the sources): `build-info.ts` throws and the build stops with a message that names the receipt; the site is never published without its commit.
- Pull request build in GitHub Actions: `GITHUB_SHA` is the merge commit of the check run; `git show -s` resolves it because `actions/checkout` fetched it. Nothing is deployed from pull requests.
- `astro dev`: the receipt shows the current `HEAD`; a dirty working tree is not detected and not claimed (the receipt says which commit, not that the tree is clean).
- Phones: four receipts wrap into two or one columns; labels and values stay on their own lines; targets keep 44 px.
- Paper theme: lines and text use the theme tokens; no new colour.
- Reduced motion: nothing animates in the band.

## Out of scope

- A live CI badge or live status indicator: both would need a request to a third party on every visit (RC-004) or a client script; the links are the verification.
- Printing scores (Lighthouse, axe, test count): they vary by host and would be claims to maintain by hand (RC-003).
- Any change to the hero copy, the section order or the about section.
- New dependencies, new JavaScript, new fonts.

## Acceptance criteria

- `npm run check` green with the new guard; `check:budget` within limits on a quiet host (ADR-0011).
- Home document at or under 30 720 B gzip, value recorded in `tasks.md`.
- axe-core: 0 violations on `/` and `/en/`, both themes, 1440 and 390 px.
- No request leaves `www.naindev.com` (or the local origin) from the band on load.
- The owner approved the wording in the pull request.

## Appendix: wording (Spanish, for the owner's approval)

- Lead: "Comprobable"
- "Código de este sitio" → `Nain9Dev/nain9dev.github.io`
- "Comprobaciones en cada cambio" → "Validación, build bilingüe y presupuesto Lighthouse en GitHub Actions"
- "Última publicación" → `<sha> · <fecha ISO>`
- "Estado de los servicios" → "Monitor público de disponibilidad y latencia"

## Session state

- Last updated: 2026-10-27, receipts-strip session.
- Done: spec, plan, tasks, ADR `Proposed`; T01 to T04 in the worktree, `npm run check` green, browser pass in both themes, both locales and on a phone (measurements in `tasks.md`); pull request open.
- Next: T05 (owner approval of the wording in the appendix and merge).
- Blocked: nothing.
