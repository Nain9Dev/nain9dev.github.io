# Unobtrusive Ecosystem Bar

Status: Implemented locally (not deployed)

## Objective

The suite bar floats over every project site. The owner reported that on some projects it covers part of the main view: a full-width bar at the top, or a pill at the top right that sits on top of page navigation and game buttons. The bar should stay out of the way by default, hide almost completely on request, and come back with one tap. The Playables site (`https://playables.naindev.com/`) must also be reachable from the bar.

## Requirements

- ECO-004 (amended): The bar shall have three states: open (full horizontal top bar), minimized (a small handle) and hidden (a thin edge tab). The open bar shall offer a button to minimize and a button to hide.
- ECO-026: When the bar is mounted and the visitor has not hidden it, and the `collapsed` attribute is absent or any value other than `false`, the bar shall render only a handle of at most 28 by 28 px, fixed on the left edge of the viewport at mid height (inset by the left safe area, anchored to no corner), with at least half of it out of view and at most 0.6 opacity until hovered or focused, when it slides fully in. Its hit area shall be larger than the part that peeks out. No full-width bar shall render. Page controls and HUDs usually live in the corners, so no corner is used.
- ECO-027: When the `collapsed` attribute is set to `false`, the bar shall open. When the visitor presses the handle, the bar shall open. When the visitor presses the hide button, the bar shall render only an edge tab at most 8 px wide, and pressing that tab shall bring the handle back.
- ECO-028: When the visitor hides the bar, the choice shall be stored (`localStorage`, key `nain_bar`) and restored on the next load of the same site. When storage is missing or throws, the bar shall still work and shall not throw.
- ECO-029: While the bar is open, pressing Escape (when no menu or panel is open) or pressing outside the bar shall return it to the handle, so it never stays over the page by accident.
- ECO-030: The project catalog shall list the Playables site: `https://playables.naindev.com/`.
- ECO-031: At phone widths (640 px and below) the open bar shall fit the viewport and keep its minimize and hide buttons reachable: it hides the project label, the status link and the text of the architecture button, and the project menu opens as a panel pinned between the screen edges instead of anchored to its button. Found at 375 px: the open bar was 566 px wide, so the hide button was off screen and the menu left the screen.

## Edge cases

- Existing consumers pass `collapsed="true"` (Orbe, Pong and others): they get the handle, which is the new default as well.
- Reduced motion: the handle and the tab do not animate their size or opacity (`prefers-reduced-motion`).
- Safe areas: the handle and the tab keep clear of a notch in landscape through `env(safe-area-inset-left)`.
- Found while checking a demo page: a first version put the handle in the bottom-left corner and it sat on top of a HUD chip. It moved to the left edge at mid height.
- The entry script stays inside the budget of ECO-003 (under 20,000 bytes raw, at most 5 KB gzip). The bar already used 5,027 of 5,120 gzip bytes, so this change removes dead and duplicated rules to pay for the new states.

## Out of scope

- The brandbook copy `ecosystem-bar.js` in the `brandbook` repository (version 2, before the split). It is not the file the sites load. Retiring it is a separate task.
- Moving the open bar away from the top of the page, and changing the panel or its profiles.

## Session state

- Last updated: 2026-11-21
- Done: owner request in chat (hide with one button, almost invisible, never cover the main view), this spec, tests, the bar, docs, browser check and the full check.
- Next: pull request and owner review. Follow-up: lazy open-bar UI (the entry has about 30 gzip bytes left).
- Blocked: nothing.
