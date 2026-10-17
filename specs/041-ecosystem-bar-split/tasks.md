# Ecosystem Bar Split and Budget Tasks

- [x] [H] Owner approval of the plan (2026-10-17): spec 041, ADR Proposed, phase A then phase B.
- [x] [A] ADR-0007 in `Proposed`.
- [x] [A] Phase A: ECO-003 measures gzip in `scripts/ecosystem-bar.test.mjs`; requirements and changelog updated; full `npm run check` green (2026-10-17).
- [x] [A] Phase B tests first: ECO-003 final, ECO-006 to ECO-010 (script run in a browser stand-in); 8 observed failing before the split.
- [x] [A] Phase B: data file `public/assets/data/ecosystem.v1.json`, panel module, slim entry. Telemetry values are escaped in the panel.
- [x] [A] PERF-003 allows `ecosystem-bar.js` and `ecosystem-bar-panel.js`; docs and changelog.
- [x] [A] Browser check on a built copy (2026-10-17): bar and 17-project menu render from the data; the panel module is requested only on first open; tabs and close work.
- [x] [A] Full `npm run check` green (2026-10-17).
- [ ] [H] Decide on the NainOrder profile: the data file is now scanned by the claims gate, which rejected "p95 Latency < 42ms"; the metric was removed from that profile's `sla` text (kept "52/52 Passing Tests · Cost 0.00 €"). Restore it only with a verified measurement.
- [ ] [H] Move ADR-0007 to `Approved` or reject it.
- [ ] [H] Push and deploy; [A] production check afterwards (`/assets/data/ecosystem.v1.json` and `/assets/js/ecosystem-bar-panel.js` return 200).
- [ ] [M] Consumers on other subdomains: confirm they load `https://www.naindev.com/assets/js/ecosystem-bar.js` instead of a local copy.

## Session state

- Last updated: 2026-10-17
- Done: phase A (commit 28969e3) and phase B local, not pushed.
- Next: owner decisions above, then push.
- Blocked: ADR-0007 approval is the owner's.
