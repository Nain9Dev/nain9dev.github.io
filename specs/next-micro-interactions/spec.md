# Specification: Micro-interactions

Status: Implemented (owner request 2026-10-22; number assigned by the merge train)

## Objective

Small, consistent press, lift and hover states on the controls that still lacked one, in CSS only, without changing any text, link, route or metadata.

## Functional requirements (EARS)

- **MI-001**: Where the visitor has not asked for reduced motion, the social pills shall lift 2 px on hover and keyboard focus, the theme toggle icon shall turn 18 degrees, and the theme toggle, filter buttons, social pills and quiet toggles shall scale to 0.96 while pressed; under reduced motion none of these movements shall run.
- **MI-002**: When the language switcher is hovered or focused, its link shall tint the background and raise the text to full ink, so every control keeps a visible hover state with a keyboard twin.
- **MI-003**: The new rules shall read colours from the tokens and shall not use `transition: all`.
- **MI-004**: axe reports no violation in either theme and the Lighthouse budget holds.

## Out of scope

- JavaScript-driven effects; new libraries; any change to copy.

## Session state

- Last updated: 2026-10-26.
- Done: CSS section, guard `scripts/micro-interactions.test.mjs`, docs.
- Next: owner review and merge.
