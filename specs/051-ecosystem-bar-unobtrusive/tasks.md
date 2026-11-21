# Unobtrusive Ecosystem Bar Tasks

- [x] [H] Owner request (2026-11-21): the bar must hide with an intuitive button, almost disappear and never cover the main view; add Playables to the bar.
- [x] [A] Spec 051 and requirements ECO-004 (amended) and ECO-026 to ECO-031.
- [x] [A] Tests first in `scripts/ecosystem-bar.test.mjs` for ECO-004 and ECO-026 to ECO-031; observed failing before each change (including the click routing test that reproduced the hide button bug).
- [x] [A] Three states, persistence, Escape, outside press and phone rules in `public/assets/js/ecosystem-bar.js`, inside the ECO-003 budget (5,088 of 5,120 gzip bytes).
- [x] [A] Playables entry in `public/assets/data/ecosystem.v1.json`.
- [x] [A] Requirements, traceability and changelog.
- [x] [A] Browser check on a demo page that loads the local script (2026-11-21): handle at the left edge, open, hide, edge tab, reload keeps it hidden, tab brings the handle back, outside press and Escape close it. At 375 px the hide button and the menu stay on screen. Found and fixed two bugs this way: the hide button acted as minimize, and the open bar overflowed on phones.
- [x] [A] Full `npm run check` green (2026-11-21).
- [ ] [H] Review and merge the pull request; [A] production check afterwards (`/assets/js/ecosystem-bar.js` and `/assets/data/ecosystem.v1.json` return the new content, and the bar shows the edge handle on `orbe.naindev.com` and `pong.naindev.com`).
- [ ] [A] Follow-up: move the open-bar UI behind a lazy import. The entry has about 30 gzip bytes of room left, and a lazy open bar would also take its cost out of every page load. Needs its own spec and an update of ECO-006.
- [ ] [M] Sites that load a local copy of the script instead of `https://www.naindev.com/assets/js/ecosystem-bar.js` keep the old behavior until they switch. The `brandbook` repository carries an older copy (version 2) that is not what the sites load.

## Session state

- Last updated: 2026-11-21
- Done: spec, tests, implementation, docs, browser check, full check.
- Next: pull request and owner review.
- Blocked: nothing.
