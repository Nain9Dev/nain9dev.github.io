# Specification: The hero's living surface is a 2D stroke field

Status: Draft (branch `feat/hero-field`, worktree `D:/wt/nain9dev.github.io-feat-hero-field`, from `origin/main` `37b9bea`)

## Objective

The owner decided on 2026-10-29 (interview, `specs/next-design-fusion`, DF-011 a) that the designer's 2D stroke field replaces the WebGL scene of the hero. The scene (an icosahedron wireframe and a point cloud, spec 030) is the one decorative element that is not part of the brand's stroke system, and it needs a WebGL probe, a context and a 327-line module. The field is the same visual language as the logo and the dimension: round-capped strokes at -52°. It is a bare 2D canvas, so it needs no WebGL context and costs less to run.

This spec supersedes HERO-001 to HERO-004 (the exact Three.js geometry, the point cloud, the camera and the 8 KiB scene) with HERO-005 to HERO-009. It changes nothing else in the hero: the copy, the offer tiles, the system map and the receipts band stay as they are (the hybrid hero is a separate pull request).

## Functional requirements (EARS)

- **HERO-005 (field)**: When the hero is drawn on a device that is not `low-performance`, a 2D canvas shall paint a staggered grid of short round-capped strokes (30 px long at -52°, 26 px step, deterministic from a hash of the cell) in `--color-stroke`, empty up to 55% of the hero width and denser toward the right, batched into 11 opacity levels (one path and one `stroke()` per level).
- **HERO-006 (lifecycle)**: While the hero is on screen, the field shall run, drawing one frame in three while nothing touches it (about 20 fps); it shall pause when the hero leaves the viewport (100 px margin) or the tab is hidden; and when 5 of the first 60 animation frames are slower than 50 ms it shall hide itself and set `low-performance`, as the scene did.
- **HERO-007 (pointer)**: While a fine pointer is over the hero, strokes within 210 px shall shrink away from it, and a press shall send a ripple that tints the strokes it crosses toward `--color-red`, with at most four ripples at once. Coarse pointers get no interaction (and no field: they are `low-performance`).
- **HERO-008 (delivery)**: When the site is built, no Three.js, WebGL scene or `hero-scene` file shall be published; the field shall load only from the idle queue (PERF-015) as a chunk of at most 8 KiB, and no page shall load it eagerly. The head still never creates a rendering context (PERF-005).
- **HERO-009 (theme and legibility)**: While a theme is shown, the field shall read `--color-stroke` and `--color-red` and repaint when the theme attribute or the system scheme changes; it shall fade out above the receipts band (CSS mask) and fade in after its first frame.

## Edge cases and error handling

- Reduced motion, phones, coarse pointers, save-data, weak hardware: the head script sets `low-performance` and the canvas is never loaded or is hidden. Same gate as the scene had; the static hero is complete without the field.
- A 2D context that cannot be created hides the canvas.
- Theme toggle while the field runs: a `MutationObserver` on `data-theme` re-reads the colours; the next frame uses them. The system scheme is watched for visitors with no stored choice.
- The canvas is `aria-hidden` and has `pointer-events: none`; pointer events are read from the hero section.

## Out of scope

- The hybrid hero (action first, offer tiles to Services), the receipts band and the hero's surface colour.
- A reduced-motion still frame (the scene had none either; the designer's prototype paints one).
- Any new dependency.

## Acceptance criteria

- `npm run check` green with `scripts/hero-field.test.mjs`; `hero-scene.js` and its test removed.
- Home document within CSS-002 and ADR-0013; chunk size recorded.
- Browser pass in both themes: field drawn, text column clear, pointer push and red ripple visible, no console errors.
- Lighthouse budget (`npm run check:budget`) unchanged or better on a quiet host (ADR-0011).

## Session state

- Last updated: 2026-10-29.
- Done: requirement text, guard (red on six tests), module, wiring, other guards moved (english-standardization, performance-build, post-paint), requirements and traceability updated, browser pass.
- Next: pull request; the hybrid hero.
- Blocked: nothing.
