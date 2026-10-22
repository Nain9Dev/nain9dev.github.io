# Specification: Visual storytelling

Status: In progress (phase 3 of the visual polish, owner request 2026-10-22)

## Objective

The home page explains what NainDev does with visuals first and as little visible text as possible, so a CTO or recruiter understands the offer in one screen and reaches the call to action in one gesture. Every sentence stays in the HTML for search engines and assistive technology; what changes is how much of it is on screen by default.

Owner decisions (2026-10-22): reduce visible text by progressive disclosure, never by rewriting copy (a copy change needs its own spec and approval); the visuals must explain what I do and how I work, show the demos working, convey the stack and the method, and make contact a single gesture.

## Functional requirements (EARS)

- **VS-001 (quiet text)**: When a home section carries an explanatory paragraph next to its heading, the paragraph shall be rendered inside a `<details>` element whose `<summary>` is a 32 px icon button with an accessible name, so the text is in the document, reachable by keyboard and screen readers, and shown only on request.
- **VS-002 (hero map)**: When the hero renders, the capability panel shall read as a pipeline diagram: three nodes joined by a rail along which a pulse travels (transform only, stopped under reduced motion and in low-performance mode); the node detail lines and the hint stay in the HTML, visually hidden.
- **VS-003 (demo gallery)**: When the live-demo strip renders, each demo shall show its capture as the tile with the title over it; host and technologies stay in the HTML, visually hidden; on phones the strip scrolls horizontally with snap points.
- **VS-004 (stack map)**: When the stack renders, each category shall read as a layer band with its label and compact badges, stacked top to bottom, every badge keeping its visible name.
- **VS-005 (method timeline)**: When the method renders on wide screens, the four steps shall sit on a horizontal rail that draws itself as it enters the viewport (scroll-driven, no JavaScript), each step keeping its number, title and one line.
- **VS-006 (one gesture)**: When the contact section renders, the primary call to action shall be the dominant element; its explanatory paragraph follows VS-001.
- **VS-007 (no copy change)**: When any page is built, its visible and hidden text, links, routes, metadata and structured data shall be identical to the previous build except for the new accessible names introduced by this spec, which are listed in `tasks.md` and translated in `src/i18n/en-US.json`.
- **VS-008 (budget)**: When the home is built, the Lighthouse budget (spec 032) shall hold; the inline document budget CSS-002 is revised by ADR-0013 and measured on every pull request.
- **VS-009 (accessibility)**: axe-core reports no violation on the eleven page types at 1440 and 390 px; nothing conveys information by hover alone; every disclosure works with keyboard and screen reader.

## Edge cases

- JavaScript disabled: `<details>` works natively; the gallery shows captures with `loading="lazy"`; the rail pulse is pure CSS.
- A demo without a capture: the tile falls back to the surface colour with the title (none today: 14 demos, 14 captures).
- Reduced motion: no pulse, no rail drawing, no image zoom.
- Low-performance mode: pulse stopped (PERF-007), reveals instant.

## Out of scope

- Rewriting or shortening any sentence; adding contact channels; changing section order (guarded by VIS-001/VIS-002 and partnership tests).
- New dependencies.

## Acceptance criteria

- `npm run check` passes with the new guard `scripts/storytelling.test.mjs`.
- Lighthouse mobile ≥ 0.95 performance, accessibility 1.00 on `/` (desktop), CLS 0.
- axe sweep clean; reduced-motion probe clean.
- Before and after captures attached to each pull request.

## Session state

- Last updated: 2026-10-22.
- Done: spec written; PR 6 (quiet text, hero map, demo gallery) in progress on `visual/06-storytelling`.
- Next: PR 7 (stack map, method timeline).
- Blocked: nothing.
