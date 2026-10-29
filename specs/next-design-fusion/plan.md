# Plan: Port the good parts of the round 4 design, layer by layer

## Approach

Seven layers, ordered from lowest risk to highest. Each is its own branch and pull request from `main`, merged only after the previous one is measured. The first three need no change to an approved requirement and give most of the visible identity. Layer 4 is the only one that supersedes requirements and waits for the owner.

| Layer | Content | Risk | Requirements touched | Depends on |
| :--- | :--- | :--- | :--- | :--- |
| 0 | This spec, plan, tasks and the logo ADR | None | — | — |
| 1 | Tokens, skip link contrast, `theme-color` per theme | Low | DF-001 to DF-003 | — |
| 2 | Isotype SVG in the header, favicons, Organization logo, OG image | Low to medium | DF-004 to DF-007 | ADR approved; vector wordmark for the full lockup |
| 3 | Deep blue footer and terminal, flat body, pressed button | Medium | DF-008 to DF-010 | Layer 1 |
| 4 | Hero, home sections, selected work and receipts band reconciliation | High | DF-011 | Owner decisions |
| 5 | `/proyectos/` with 22 projects, six on the home | Medium | DF-012 | Layer 4 |
| 6 | Services hub, article, technology and contact pages | Medium | DF-012 | Layer 4 |

## Layer notes

### Layer 1

Add the missing roles beside the existing ones in `src/styles/main.css`, using the values of the prototype's role table (`design/home-redesign/README.md`, "The two expressions"). Do not rename or retune anything. The skip link moves to white on `--color-cobalt` (8.44:1). `theme-color` is switched by the existing theme script (TH-003), not by a new one. Size cost is measured against ADR-0013.

### Layer 2

The isotype is three strokes with round caps, taken from the prototype's favicon geometry (`M148 148V848 M308 288L686 738 M848 148V848`, width 113 in a 1000 box). It is inlined in `Header.astro` and coloured with `--color-logo`, which removes the 1600 px raster `src/assets/images/logo_horizontal.png` from the header. The wordmark waits for David's vector (his README lists the logo folder as pending); the raster wordmark (423 x 38 px) is not used. Icons are regenerated from the same geometry, one SVG favicon per theme. The change of identity is recorded in the logo ADR, which only the owner moves to `Approved`.

### Layer 3

Footer and terminal take `--brand-deep` in both themes (today the paper footer is a washed gradient); the footer re-declares the dark roles it reads, because aliases keep the value they had where they were declared. Code blocks and diagrams are measured separately (T08c). The pressed button already matches the prototype. Removing the body vignette, grid and pointer glow is not part of the layer: it supersedes spec 045, ADR-0012 and two guards, so it waits for the owner (DF-009, T08b). The earlier version of this plan said layers 1 to 3 touch no approved requirement; that was wrong for DF-009.

### Layer 4

Not planned in detail. Questions are DF-011. The prototype's home has seven sections and removes LiveDemos and ProofStrip; `main` now has selected work, case pages and a receipts band that the prototype never saw. The layer starts with a diff of the two compositions on a phone and on desktop, then a plan the owner approves.

## Verification for every layer

- `npm run check`, then `npm run build`; measurements in `tasks.md` (home gzip against the CSS-002 tripwire and ADR-0013, CSS size).
- Browser pass in both themes, both locales, 1440 and 390 px; axe-core.
- The prototype's `tools/check.mjs` is read for ideas (contrast of every text run on its real background, first painted frame, no flash); it is not imported. A guard for contrast may come out of layer 1.

## Risks

- The page budget (ADR-0013, CSS-002): every layer measures before and after.
- Identity change (layer 2): old logo remains on external profiles (LinkedIn, Google Business, freelance platforms) until the owner updates them.
- The prototype is a moving target: David may change `design/home-redesign`; each layer pins the commit it ported from in `tasks.md`.
- Credit and partnership wording are David's call (DF-014).
