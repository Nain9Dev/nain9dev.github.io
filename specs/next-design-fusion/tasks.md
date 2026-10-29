# Tasks: Port the good parts of the round 4 design

Prototype pin: `design/home-redesign` at `89e15d8` (2026-10-26); viewer `design/round-4-preview` at `3ba9447` (2026-10-29).

## Blockers (external, listed before code)

| Item | What it is | Who | Unblocks | Ready when |
| :--- | :--- | :--- | :--- | :--- |
| Vector wordmark | SVG or `.ai` of the NAINDEV wordmark and the full lockup | `[H]` David | DF-005, full lockup | File received and read |
| Logo ADR approval | `ADR-next-design-fusion-logo` moves to `Approved` | `[H]` owner | Layer 2 | Status changed by the owner |
| Home decisions | DF-011 (a) to (d) | `[H]` owner | Layer 4 | Answers recorded in `spec.md` |
| Credit wording | Form and place of David's credit | `[H]` David | DF-014 | Written in the README by him |
| External profiles | Replace the old logo on LinkedIn, Google Business, Workana, Freelancer, Upwork | `[H]` owner | Identity consistency after layer 2 | Owner confirms |

## Layer 0

- [x] **T00** `[A]` Worktree, claim, spec, plan, tasks and ADR `Proposed`.
  - **Done when**: the four files exist and the claim is in `D:/wt/CLAIMS.md`.

## Layer 1: tokens

- [x] **T01** `[A]` Guard `scripts/design-tokens.test.mjs`, written first and registered in `npm run check`: asserts DF-001 (roles exist, existing values unchanged) and DF-002 (skip link contrast).
  - **Covers**: DF-001, DF-002
  - **Done when**: it fails on `main` for the expected reasons.
- [x] **T02** `[A]` Add the roles and constants in `src/styles/main.css`; fix the skip link; `theme-color` follows the theme.
  - **Covers**: DF-001 to DF-003
  - **Done when**: the guard passes and `npm run check` is green; sizes recorded below.
- [ ] **T03** `[M]` Browser pass and pull request with captures in both themes and on a phone, axe, document size.
  - **Covers**: DF-013
  - **Needs from owner**: review and merge.

## Layer 2: logo

- [x] **T04** `[H]` Owner approved `ADR-next-design-fusion-logo` in chat on 2026-10-29.
- [x] **T05** `[A]` Guard `scripts/design-logo.test.mjs` for DF-004 to DF-007 first (red on three of four tests); `check-brand-icons.mjs` and PERF-009 adapted to the inline mark.
- [x] **T06** `[A]` Isotype SVG in `Header.astro`, text name interim, SVG mark and PNG and ICO icons regenerated with `scripts/generate-brand-icons.mjs`, old raster logo deleted.
  - **Done when**: guard green, header measured at 1440 and 390 px in both themes (done, see Measurements).
- [ ] **T07** `[M]` Pull request and external profile update list.
  - **Needs from owner**: review and merge; upload the new avatars to the brand accounts (list below).
- [ ] **T07b** `[A]` Open Graph image `og-cover-v4.jpg` still shows the old horizontal logo; regenerate it with the new mark (spec 026 weight budget applies).
- [ ] **T07c** `[H]` Vector wordmark from David, then the full lockup in the header (DF-005).

## Layer 3: surfaces

- [x] **T08** `[A]` Guard and implementation of DF-008 for the footer and the terminal (`scripts/design-surfaces.test.mjs` written first, red on both tests, then green).
  - **Covers**: DF-008
  - **Done when**: `npm run check` green; sizes and the browser pass recorded below. DF-010 needs no change.
- [x] **T08b** `[H]` Owner decided DF-009 on 2026-10-29: the vignette, grid and pointer glow stay (discarded).
- [ ] **T08c** `[A]` Measure code blocks and diagrams on `--brand-deep` and decide whether they join DF-008.

## Layer 3b: section heads and key cards

- [ ] **T12** `[A]` Guard first for DF-016 (dimension markup with data-derived labels, solid shadow tokens, no script), then the section head dimension and key card shadow, one block at a time with captures.
  - **Done when**: `npm run check` green, home size recorded against CSS-002, captures in both themes and on a phone.
- [ ] **T07b** (above) Open Graph image with the new mark goes in the same step.

## Layers 4 to 6

- [x] **T09** `[H]` Owner answered DF-011 on 2026-10-29 (recorded in `spec.md`).
- [ ] **T10** `[A]` Layer 4 plan: the 2D stroke field in place of the WebGL scene (HERO-001 to HERO-004 superseded by a new requirement), keeping the current section order.
- [ ] **T11** `[A]` Specs for `/proyectos/` and the inner pages (after layer 4).

## Measurements

- Layer 1: home document 28 772 B gzip (`/en/` 28 146 B) against the 30 720 B tripwire; 28 589 B on `main` `dd53c76`, so the layer costs about 183 B (16 role lines in three blocks, the skip link and the second `theme-color` tag).
- Skip link: white on `--color-cobalt`, 8.44:1 in both themes (2.74:1 before).
- `npm run check` green with the new guard (build, performance tripwire, locales, claims).
- Browser pass (headless Chrome on the built `dist/`, `/` and `/en/`, 1440 and 390 px, system dark and light): the skip link takes focus with `rgb(0, 71, 171)` background and white text; the two `theme-color` tags carry the dark and light values; a stored `light` choice on a dark system gives `#edf1f6` in both tags before the first paint, and the toggle flips them to `#070b16` (and the reverse for a stored `dark`).
- axe-core 4.13 (WCAG 2.0 to 2.2 A/AA), eight runs: 0 `color-contrast` violations. Only `target-size` remains, on `.quiet > summary` (method and about sections) and the fifth `.repo-code` link, in every run. The same elements fail the same rule on `main` `dd53c76` (baseline run on its build), where the skip link also failed `color-contrast` in the dark runs; this layer removes that one and does not touch the others. The `target-size` findings are open for a separate fix.

- Layer 3: home document 28 824 B gzip (`/en/` 28 198 B) against the 30 720 B tripwire; 28 772 B after layer 1, so +52 B (the band tokens, the footer scope and `--terminal-red-ink`).
- Footer: computed background `rgb(0, 43, 102)` with no gradient on `/`, `/en/` and `/servicios/`, 1440 and 390 px, system dark and light; captures in both themes and on a phone read correctly (chips, status pill, links). Terminal skin: computed background and header `rgb(0, 43, 102)` in both themes; its text roles measure 4.55:1 or more on the band (error text on `#ff5c6c` 4.55:1, the old mixed red was below AA). A capture of the terminal itself was not obtained from the headless run (the section stays unpainted until it scrolls into view); open for the browser pass of the pull request.
- axe-core on the twelve runs above: no new violation. `target-size` on `.quiet > summary` and the fifth `.repo-code` link, and one `color-contrast` on a catalog `.project-link` at 390 px paper in `/en/`, appear identically on the `main` build.

- Layer 2: home document 28 898 B gzip (`/en/` 28 269 B) against the 30 720 B tripwire; 28 824 B after layer 3, so +74 B (inline mark and name instead of an image tag). The header serves no image request now (the 1600 px raster was a priority image).
- Header: brand 146 x 38 px at 1440 and 128 x 38 px at 390 (mark 38 px), stroke and name `rgb(255, 255, 255)` in dark and `rgb(0, 71, 171)` in paper, Urbanist 800, no horizontal overflow; header height 97 px at 1440 and 61 px at 390. Captures read correctly in both themes.
- Icons: `scripts/generate-brand-icons.mjs` renders the SVG mark to `favicon-96x96.png`, `apple-touch-icon.png` and four ICO frames (16, 32, 48, 64); `npm run check:brand-icons` passes.
- axe-core on eight runs: the only `color-contrast` findings are footer elements at 390 px in paper, where axe reads the footer background as the page paper because the footer (`content-visibility: auto`) has not been painted yet; with the footer scrolled into view there are none. `target-size` findings are the same as on `main`.

## Social profiles to update (owner, T07)

Two 1024 px avatars were generated outside the repository from the same geometry: the blue isotype on white (brand accounts show the logo on white) and the green isotype on the deep blue tile. Accounts that show the NainDev logo and need the new one: LinkedIn page NainDev, GitLab, X `@Nain9Dev`, Instagram `@nainndev`, TikTok `@nain9dev`, YouTube NainDev and Google Business. Personal accounts keep the photo; "Hábitos de un Dev" keeps its own avatar.

## Guard changes

- `scripts/design-logo.test.mjs` (new, registered in `npm run check`): DF-004 to DF-007. `scripts/check-brand-icons.mjs` now measures the green strokes against the circular mask (the tile is not part of the framing) and expects the inline mark in the header; PERF-009 now asserts the header serves no image.

- `scripts/design-surfaces.test.mjs` (new, registered in `npm run check`): the terminal and footer bands and their text contrast. `scripts/themes.test.mjs` TH-002 now pins `--terminal-bg: #002b66` (value moves with its requirement, ADR-0012 consequences).
- `scripts/design-tokens.test.mjs` (new, registered in `npm run check`): DF-001 (new roles in dark and both light blocks, no existing role changed, AA contrast of heading and error text on every surface, 3:1 for stroke and focus), DF-002, DF-003.

## Session log

- 2026-10-29 · Layers 1 and 3 merged (#42, #43). Owner interview answered DF-011 and DF-009; owner approved the logo ADR. Layer 2 in `D:/wt/nain9dev.github.io-feat-design-logo` on `feat/design-logo`: inline isotype and text name in the header, new SVG mark and regenerated icons, old raster logo deleted, social avatars generated. Next: pull request; T07b (OG image), T07c (vector wordmark), layer 4 plan.
- 2026-10-29 · Worktree `D:/wt/nain9dev.github.io-feat-design-fusion` on `feat/design-fusion` from `origin/main` `dd53c76`; backup branch `naindev/legacy-2` created at the same commit; spec, plan, tasks and ADR written; claim registered. Next: owner decision on the logo ADR; ask David for the vector wordmark.
- 2026-10-29 · Layer 1 implemented test first (guard red on the skip link, roles and bar colour, then green): roles and brand constants in `main.css` (dark root and both light blocks), skip link on the action colour, two `theme-color` tags by scheme, updated by the head script and the toggle when a choice is stored. Nothing committed. Next: T03 (browser pass, axe, pull request).
- 2026-10-29 · Layer 1 merged to `main` as #42. Layer 3 in `D:/wt/nain9dev.github.io-feat-design-surfaces` on `feat/design-surfaces` from `origin/main` `9aecce7`: DF-008 for footer and terminal done test first; DF-009 not implemented because it supersedes spec 045, ADR-0012 and two guards (needs the owner); DF-010 already satisfied. Next: pull request, then T08b and T08c, T04 (logo ADR).
