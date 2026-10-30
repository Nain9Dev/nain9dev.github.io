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
- **DF-006 (icons)**: When the site is built, `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png` and the SVG mark shall show the new mark: the isotype in `#80FF00` on a rounded `#002B66` tile, the same in both themes (the SVG is not declared as a favicon, PERF-018, so it does not need a theme variant). The icon contract (`scripts/check-brand-icons.mjs`) measures the green strokes, not the tile, against the circular mask.
- **DF-007 (consistency)**: The Organization structured data `logo` URL, the default Open Graph image and every other file that shows the old logo shall be listed and updated in the same pull request, or listed as open in `tasks.md`. The logo URL points at the touch icon, so it shows the new mark; the default Open Graph image is now `og-cover-v5.jpg`, with the new isotype and name where the old horizontal logo was (T07b). It has a new name so that link-preview caches refresh; `og-cover-v4.jpg` is removed.

### Layer 3: surfaces and states

- **DF-008 (invariant bands)**: The footer and the terminal shall use `--brand-deep` in both themes, the footer carrying the dark role values and the terminal text keeping AA contrast on the band (error text on `--terminal-red-ink`). Implemented in `feat/design-surfaces`. Code blocks, diagrams and the hero scene stay as they are until they are measured on their own.
- **DF-021 (footer columns)**: When any page is built, the footer shall show the brand (isotype and vector wordmark, with an id of its own), four short columns (Servicios, Contenido, Tecnología, Contacto), the links that left the top bar in Contenido, and one legal line "© year NainDev · Analítica sin cookies", with no emoji and no credit (the credit to the designer lives in the collaboration section, DF-011 j). The five technology links replace the seven specialty chips; the footer navigation sits inside a `data-nosnippet` `div`, since the attribute is not valid on `nav`. Decided by the owner on 2026-10-29 from the designer's footer.
- **DF-022 (two construction motions)**: When a page loads, the header mark (three separate strokes, `pathLength` 1) shall draw itself once, one stroke after another (420 ms, 90 ms apart); and when a section head comes into view, its `h2` shall be uncovered once by a clip-path mask with a 35% drop (520 ms, 120 ms delay), in the reveal that already moves the head. Both shall run only without a reduced-motion preference and not on `low-performance` devices (the title mask only after the script set `motion-ready`), never loop and hide nothing at rest. Chosen by the owner on 2026-10-30 from the designer's mark build and line mask; the other motions of his system (the agenda loop, the 3D mesh scan, the brackets) are not adopted.
- **DF-024 (contact page)**: When the site is built, `/contacto/` and `/en/contact/` shall be indexable and in the sitemap and shall offer the three ways to reach the owner: the 30-minute free call, a copy-email button and LinkedIn, with the texts the owner approved on 2026-10-30 (from the designer's contact page). The address shall stay out of the markup (MAIL-006) and there shall be no WhatsApp link until B-014 and OQ-014 are resolved. The top bar does not change; the footer links the page in a later step.
- **DF-027 (flow diagrams in service cards)**: When the home renders its three service cards, each shall lead with a 288 x 64 stroke diagram (decorative, no text) that shows the mechanism of the service and ends in a green result, in place of the icon; it shall be drawn once, only without a reduced-motion preference and not in low-performance mode, with no loop. Decision of the designer's round 4 (T13), adopted under the owner's direction of 2026-10-30 to make the first glance more visual with less text.
- **DF-025 (clean top bar)**: When the site is built, the top bar shall hold the brand, the three section links, one theme toggle and one language toggle that offers the other language (EN on Spanish pages, ES on English pages) with its full name as accessible name. The "Agendar llamada" button leaves the bar; the call stays in the hero, the contact section, the contact page and the footer. Proposed by the owner on 2026-10-30 to keep the bar clean; superseded wording of DF-019 (two codes) and of the call button in the bar.
- **DF-026 (lean hero)**: When the home renders, the hero shall hold the eyebrow, the title, the two actions, one summary line, the availability line, the stack line (COPY-011, one mono line) and the receipts band, and nothing else: the capability panel (VS-002) and the scroll cue leave it, so the field and the deep blue band are what the visitor sees first. The three links of the panel stay reachable from the sections themselves. Approved by the owner on 2026-10-30 ("Sí, quitarlo").
- **DF-009 (flat page, discarded)**: The prototype's flat page background (no vignette, grid or pointer glow) is **not adopted**. The owner decided on 2026-10-29 to keep direction B: spec 045 and ADR-0012 keep the vignette, the 4 rem grid and the pointer-lit grid, and `scripts/hero-nav.test.mjs` and `scripts/post-paint.test.mjs` keep asserting them.
- **DF-010 (pressed button, already satisfied)**: While a button is pressed, its shadow shall shrink and turn `--color-red`. `main` already does it (`.button:active` moves the button back and draws a 2 px red ring), so nothing changes.
- **DF-020 (hero band)**: When the home is built, the hero shall be a full-bleed band in `--brand-deep` in both themes, like the footer: it shall use the band's ink, link and stroke colours and surfaces taken from the band (so the system panel and the receipts read in either theme), the stroke field shall paint above its background, and the primary button shall be `--brand-green` with `--brand-deep` ink (the cobalt button sinks into the band). Decided by the owner on 2026-10-29 after comparing with the designer's hero (a deep blue band, 700 px, green primary). The H1 (70 px, 800) and the secondary button stay. This extends ADR-0012's "green only for live marks" to the primary action on the band; the owner reviews it in the pull request. The home document, the Lighthouse budget and axe on the hero (8 combinations) are recorded in the pull request.

### Layer 4: home composition (blocked)

- **DF-011 (owner decisions, answered 2026-10-29 in an interview)**:
  - (a) The 2D stroke field **replaces** the WebGL scene, which supersedes HERO-001 to HERO-004 and `scripts/hero-scene.test.mjs`; the layer 4 spec states the new requirement and moves the guards with it.
  - (b), (c) **The current structure leads**: selected work, the work pages and the receipts band keep their place. Hero, strokes and surfaces from the prototype enter; LiveDemos and ProofStrip leave only if a later decision says so (VP-010 stays as is until then).
  - (d) **Fonts stay as on `main`** (Urbanist, Inter, the system mono stack); FONT-001 is unchanged.
  - (e) **A `/proyectos/` route** with the 22 projects is adopted, with its own spec after the home (DF-012).
  - (f) **Logo**: the isotype is adopted, the full lockup waits for the vector wordmark (ADR-next-design-fusion-logo).
  - (g) **Stroke system**: only the dimension (a measuring line with a real label in each section head) and the solid shadow on key cards are ported (DF-016). The interruption and the pattern are not adopted for now.
  - (h) **Services**: the current grouping by problem stays and each group gains the designer's stroke diagram; no regrouping and no route change.
  - (i) **Motion**: ADR-0012's rules stay; the only addition is a one-time stroke construction on entry that respects reduced motion. No permanent loops and no port of the designer's `motion.js` (the mark-to-agenda loop is not adopted).
  - (j) **Credit**: David's credit lives only in the home's collaboration section (Contrast3D x NainDev), in the form he chooses (DF-014); it is not added to the footer.
  - (k) **Brandbook v2.0** stays in the repository as reference and is not published at any route.
  - (l) **Hero content**: hybrid. The message and the call button lead (on a phone right after the H1); the three offer cards move to the services section.
  - (m) **Order**: section heads and cards (with the Open Graph image), then the hero with the 2D field, then `/proyectos/` and the inner pages, one pull request each.

### Layer 3b: section heads and key cards (next)

- **DF-017 (services diagram)**: When `/servicios/` is built, it shall show the designer's agenda diagram once after the heading: an inline decorative SVG of thirteen round-capped strokes (45 units, 1000 x 700 box) in `--color-stroke` on `--color-sunken`, hidden on phones. The strokes shall draw in once (900 ms, staggered 80 ms) only when the visitor has no reduced-motion preference and the device is not `low-performance`; the animation shall not loop and shall hide nothing at rest. This is the designer's `.agd` at rest, without its 8 s looping cycle, which conflicts with the owner's decision of a one-time build (DF-011).
- **DF-016 (dimension and solid shadow)**: When a section head renders on the home and on the inner pages, it shall carry a dimension: a line with ticks in `--color-stroke` and a label that states a real count taken from data (for example the number of projects), never a decorative text. Key cards shall use the solid shadow with no blur, in line with ADR-0012's "one card system": `main` already does (`--shadow-raised` 8 px and `--shadow-panel` 12 px, offset only), so this part needs no change and a guard keeps it. The dimension is static (no loop), adds no script and keeps the home within CSS-002 and ADR-0013; the pull request records the measured size. **Implemented** on the home (services, selected work, projects) and the services hub, with labels such as "15 servicios", "4 proyectos seleccionados" and "22 proyectos" read from the services collection and `projects.json`. The line uses `--color-stroke`, which is brand green on the dark surface: this extends ADR-0012's rule "green only for live marks, focus and the signature underline" to the brand stroke, and the owner reviews it in the pull request (one token to change if not).

### Layers 5 and 6: catalog route and inner pages (not started)

- **DF-012 (scope)**: A `/proyectos/` route with the 22 projects, the six-project home and the redesigned inner pages shall each get their own spec after layer 4 is decided.

### Guards for every layer

- **DF-019 (language switch)**: When any page is built, the language switch shall show the short codes ES and EN in the mono face, each link keeping a 44 px target, its `lang`, `hreflang` and `aria-current` and its full language name (Español, English) as the accessible name. Decided by the owner on 2026-10-29 from the designer's compact switch.
- **DF-013 (verification)**: Before each pull request, `npm run check` shall pass, the home document shall stay within the CSS-002 and ADR-0013 limits with the measured value recorded in `tasks.md`, axe-core shall report no violation on `/` and `/en/` at 1440 and 390 px in both themes, and the pull request shall carry captures in both themes and on a phone.
- **DF-014 (attribution)**: When any layer that uses David's design is published, the repository README shall credit his design in the form he chooses; the credit and any mention of Contrast3D are his decision, and nothing shall claim joint clients or projects.
- **DF-015 (size of the change)**: Each layer shall be one pull request that can be reverted without touching the others, and shall not import prototype files that the layer does not use.
- **DF-018 (top bar)**: When any page is built, the top bar shall have three links, Services, Projects and Blog, each a stroke icon and one word, with the link of the section the visitor is in marked `aria-current="page"` and drawn with the signature sweep. The links that left the bar (Arquitectura Frontend, Cómo trabajo, Sobre mí) shall stay one click away in a footer navigation, in both languages. Decided by the owner on 2026-10-29 after comparing with the designer's bar, which has six text links; the designer's compact language switch and menu sheet are not part of this layer.

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
