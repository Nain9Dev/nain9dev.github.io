# Implementation plan: Themes

Status: Implemented

## Modules

- **Tokens** (`main.css`): light values under `:root[data-theme="light"]` and, for the system preference, under `@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) }`; a `--color-shadow` role so solid shadows are deep cobalt on the dark surface and brand black on paper; `--terminal-*` tokens so `terminal.css` never follows the theme. Covers TH-001, TH-002.
- **Head script** (`BaseLayout.astro`): reads `localStorage.theme` before first paint and sets `data-theme`. Covers TH-003.
- **Toggle** (`Header.astro`, `site-interactions.js`, `app.js`): a 44 px button inside `.header-actions` (the container the English build already uses), moon on dark, sun on light, `aria-pressed` reflects the effective theme, choice persisted. Covers TH-003, TH-004.
- **Guards** (`scripts/themes.test.mjs`): palette values and WCAG contrast computed in the test, terminal isolation, head script, toggle semantics; `visual-tokens.test.mjs` accepts colour literals in any `:root` block.

## Key decisions

- Explicit choice beats the system preference; no "auto" option in the control (the absence of a choice is auto). ADR-0014.
- Images, the WebGL scene and code blocks keep their dark rendering: no asset duplication.
- Verification uses `prefers-color-scheme` emulation through the DevTools protocol for the light pass.
