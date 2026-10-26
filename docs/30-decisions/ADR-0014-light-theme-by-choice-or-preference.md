# ADR-0014: Light theme by visitor choice or system preference

Status: Proposed
Date: 2026-10-22

## Context

Spec 045 set the dark expression of the brand as the site's single theme. The brandbook also defines the paper expression (paper `#EDF1F6`, deep blue ink `#002B66`). On 2026-10-22 the owner asked for an automatic light mode and for the visitor to be able to choose, and raised the idea of letting visitors customise colours freely.

## Decision

- Two themes, both from the brandbook: the dark palette stays the default; the paper palette applies when the system prefers light and the visitor made no choice, or when the visitor chose it from a header toggle. The choice persists in `localStorage` and is applied before first paint.
- The themes share every colour role (tokens); only values change. Solid shadows get a role of their own (`--color-shadow`). The terminal, the images, the WebGL scene and the code blocks keep their dark rendering.
- No free colour picker: arbitrary colours break the contrast guarantees and the brand. If a wider choice is wanted, a later spec offers a curated set of brand-compatible accents, each verified for contrast.

## Consequences

- Every new colour must be declared for both themes; `scripts/themes.test.mjs` computes the paper contrasts, so a value that fails AA fails the build.
- Audits run twice (dark, and light through `prefers-color-scheme` emulation).
- One new UI string, the toggle's accessible name.

## Alternatives considered

- **System preference only**: no way for a visitor to override a bad guess on a shared or corporate machine.
- **Three-state control (auto/light/dark)**: more UI for little gain; the absence of a stored choice already means auto.
- **Free colour customisation**: rejected for brand and accessibility reasons, as above.
