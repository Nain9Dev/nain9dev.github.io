# Specification: Themes

Status: Implemented (owner request 2026-10-22; PR open)

## Objective

Offer the brandbook's paper palette as a light theme, chosen by the visitor from the header or taken from the system preference, with the dark palette of spec 045 as the default. Same colour roles, same components; only the token values change.

## Functional requirements (EARS)

- **TH-001 (paper palette)**: When the document carries `data-theme="light"`, or the system prefers light and no choice was made, the tokens shall switch to the brandbook paper values (`#EDF1F6` paper, `#F7F9FC` surface, `#002B66` ink, `#0047AB` cobalt, green ink `#2E6B00`, red ink `#C4001A`, brand black `#1D1D1B` for solid shadows), every text token reaching 4.5:1 on paper and on white.
- **TH-002 (dark default)**: While no choice and no light preference exist, the dark palette shall apply; the terminal shall keep its dark skin in both themes.
- **TH-003 (choice)**: When the visitor presses the header toggle, the theme shall switch, the choice shall persist in `localStorage` and apply before first paint on the next load; the toggle is a `button` with an accessible name and `aria-pressed` meaning "light".
- **TH-004 (no copy change)**: One new accessible name ("Modo claro" / "Light mode"); no other text, link, route or metadata changes.
- **TH-005 (audits)**: axe reports no violation in either theme on the key pages at 1440 and 390 px; the Lighthouse budget holds.

## Out of scope

- A free colour picker. Custom accents would leave the brand palette; if wanted, a later spec offers a curated set.
- Light variants of images, the WebGL scene and code blocks (they keep their dark rendering).

## Session state

- Last updated: 2026-10-22.
- Done: implementation on `visual/13-themes` (stacked on `visual/12-og`); guards, axe in both schemes, captures, Lighthouse; TH-001 to TH-005 consolidated into `docs/10-requirements.md` and `docs/50-traceability.md`.
- Next: owner review and merge; ADR-0014 approval.
