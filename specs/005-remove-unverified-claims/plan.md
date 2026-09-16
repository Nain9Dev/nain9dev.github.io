# Remove Unverified Claims Plan

1. Add `scripts/check-claims.mjs` with an exported `findBlockedClaims(text)` and
   a CLI that scans tracked source (`src/components`, `src/pages`, `src/content`
   excluding `marketing/`) and built HTML under `dist/`.
2. Add `scripts/claims.test.mjs`: unit cases for the matcher and a source scan
   that must report no findings. It fails before the content change.
3. Remove the Hero badge and the thank-you page badge.
4. Remove the two obsolete catalog entries from `src/i18n/en-US.json`.
5. Wire `check:claims` into `npm run check` after the build so both locales are
   scanned.

Blocked patterns: `+50M` and `50M modelos` / `50M models`, case-insensitive.
Plain file sizes such as "50MB" are not matched.
