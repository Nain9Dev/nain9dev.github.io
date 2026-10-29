# Specification: Port the good parts of the round 4 design, layer by layer

Status: Draft (branch `feat/design-fusion`, worktree `D:/wt/nain9dev.github.io-feat-design-fusion`, from `origin/main` `dd53c76`)

## Objective

David Esteban (`davidesuarez`, Contrast3D x NainDev) delivered round 4 of the visual redesign ("fusion") on `design/home-redesign` (commit `89e15d8`, 2026-10-26) and a viewer of the same files on `design/round-4-preview` (commit `3ba9447`, 2026-10-29, no shared history with `main`, `site/` is a byte copy). It merges his logo and stroke system with the deep blue expression that `main` already runs (ADR-0012 to ADR-0014). His own README, section "How to port it to main", proposes the port as a spec.

This spec ports only the parts that make the portfolio better, in small layers that can each be merged, measured and reverted alone. Nothing is ported because it exists in the prototype. Each layer has an entry criterion (it fixes a measured defect or adds identity value), a size budget and a stop condition. The home composition (layer 4) is blocked on owner decisions and is not specified here beyond its questions.

`main` is production. The prototype is reference material: its CSS (`nain.css`, 1 086 lines) is not copied wholesale into `src/styles/main.css` (3 259 lines), because the page budget (CSS-002, ADR-0013) and the per-page stylesheet split (ADR-0017) leave no room for a second system next to the first.

## Reference sources

| What | Where |
| :--- | :--- |
| Prototype (source of truth) | `origin/design/home-redesign`, `design/home-redesign/` |
| Prototype viewer | `origin/design/round-4-preview`, `site/` |
| Port notes written by David | `design/home-redesign/README.md`, "Round 4 — fusion", "How to port it to main" |
| Logo files | `design/home-redesign/assets/logo/` (PNG plus two SVG favicons) |
| Backups of production | `origin/naindev/legacy` (`77317aa`, before the redesign) and `origin/naindev/legacy-2` (`dd53c76`, 2026-10-27) |

## Functional requirements (EARS)

### Layer 1: tokens

- **DF-001 (new roles)**: When the stylesheet is built, `src/styles/main.css` shall define the roles `--color-sunken`, `--color-heading`, `--color-stroke`, `--color-focus`, `--color-red-ink` and `--color-logo`, and the brand constants `--brand-deep`, `--brand-green`, `--brand-red` and `--brand-black`, with the dark and paper values of the prototype's role table, and no existing role shall change value.
- **DF-002 (skip link)**: When the skip link receives focus, its text shall have a contrast ratio of at least 4.5:1 against its background in both themes (it is 2.74:1 today).
- **DF-003 (theme colour)**: When the theme is applied, `<meta name="theme-color">` shall follow it (`#070B16` dark, `#EDF1F6` paper) before the first paint, without adding an inline script beyond what TH-003 already allows.

### Layer 2: logo and favicons (decision in `ADR-next-design-fusion-logo`)

- **DF-004 (isotype)**: When the header renders, the brand link shall show the N isotype as inline SVG drawn from the prototype's stroke geometry, coloured by `--color-logo`, with the accessible name "NainDev" and the same link target as today.
- **DF-005 (wordmark)**: The wordmark shall be published only as a vector. Until David delivers it, the header shall show the isotype followed by the text "NainDev" in the heading font; no raster wordmark shall be published.
- **DF-006 (icons)**: When the site is built, `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png` and an SVG favicon shall show the new mark, the SVG favicon following the theme.
- **DF-007 (consistency)**: The Organization structured data `logo` URL, the default Open Graph image and every other file that shows the old logo shall be listed and updated in the same pull request, or listed as open in `tasks.md`.

### Layer 3: surfaces and states

- **DF-008 (invariant bands)**: Terminal, code blocks, diagrams, footer and the hero scene shall use `--brand-deep` in both themes.
- **DF-009 (flat page)**: The page background shall be flat `--color-bg`; the cobalt vignette, the grid and the pointer glow shall be removed together with `src/scripts/ambient-glow.js`, and no request or script they needed shall remain.
- **DF-010 (pressed button)**: While a button is pressed, its shadow shall shrink and turn `--color-red`.

### Layer 4: home composition (blocked)

- **DF-011 (owner decisions)**: Before any home change, the owner shall decide: (a) whether the 2D stroke field replaces the WebGL scene, superseding HERO-001 to HERO-004; (b) whether LiveDemos and ProofStrip leave the home, with an exception to VP-010; (c) how selected work (spec 049) and the receipts band (`next-receipts-strip`) sit with the new hero; (d) fonts, keeping Inter and the system mono stack or moving to IBM Plex Mono (FONT-001).

### Layers 5 and 6: catalog route and inner pages (not started)

- **DF-012 (scope)**: A `/proyectos/` route with the 22 projects, the six-project home and the redesigned inner pages shall each get their own spec after layer 4 is decided.

### Guards for every layer

- **DF-013 (verification)**: Before each pull request, `npm run check` shall pass, the home document shall stay within the CSS-002 and ADR-0013 limits with the measured value recorded in `tasks.md`, axe-core shall report no violation on `/` and `/en/` at 1440 and 390 px in both themes, and the pull request shall carry captures in both themes and on a phone.
- **DF-014 (attribution)**: When any layer that uses David's design is published, the repository README shall credit his design in the form he chooses; the credit and any mention of Contrast3D are his decision, and nothing shall claim joint clients or projects.
- **DF-015 (size of the change)**: Each layer shall be one pull request that can be reverted without touching the others, and shall not import prototype files that the layer does not use.

## Edge cases and error handling

- The prototype PNG captures (`exports/`, about 640 files) shall not be imported: they are heavy, permanent in a public history and not needed by the site.
- A prototype token that differs from `main`'s value is a defect of the port notes, not a reason to change `main`; the layer reports it instead of changing the role.
- The prototype branch predates specs 049 and 050 and `next-receipts-strip`, `next-private-diagrams`; any port of the home must be rebased onto them mentally and in the spec, not copied.

## Out of scope

- The prototype's LAB page, FIX mode, brandbook page and check scripts as site features (the check script may inspire a guard, see `tasks.md`).
- New dependencies, new fonts and new routes before their layer is decided.
- Changes to content, routes, SEO fields, canonical URLs or the ecosystem bar.

## Acceptance criteria

- Each merged layer meets DF-013 and records its measurements.
- The owner approved the logo ADR before layer 2 merges.
- No layer changes a requirement without the owner's explicit decision recorded in this spec.

## Session state

- Last updated: 2026-10-29, design-fusion session.
- Done: prototype read (README, logo files, token table, port notes); spec, plan, tasks and ADR `Proposed` written.
- Next: owner decision on the logo ADR and on layer order; request the vector wordmark from David.
- Blocked: DF-005 (vector wordmark, David); DF-011 (owner decisions).
