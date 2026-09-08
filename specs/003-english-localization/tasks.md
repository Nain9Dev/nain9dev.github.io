# English Localization Tasks

- [x] [A] Inspect current site, deployment and NainWrite capabilities.
- [x] [A] Specify scope, dependencies and acceptance boundaries.
- [x] [A] Add and observe failing localization tests.
- [x] [A] Implement safe extraction, catalog validation and static English output.
- [x] [A] Localize interactive text and equivalent-page navigation.
- [x] [A] Prepare and check initial English catalog.
- [x] [A] Implement local draft generation and changed-source synchronization.
- [x] [A] Run complete checks and browser verification.
- [x] [A] Review flagged translations and publication readiness.
- [ ] [A] Verify the authorized production release when editorial gates are satisfied.

## Handoff

- Done: Deterministic HTML localization, shared runtime messages, local draft
  generation, independent advisory audit and private noindex preview.
- Verified: Full npm run check passes: 11 localization unit/integration tests,
  three SEO tests, 142 documents, 10 redirects and 66 indexable URLs. Astro reports
  zero errors, zero warnings and 43 pre-existing hints. All icon checks pass.
  All 1,519 English targets received an editorial reading; observed wording,
  context leakage, false friends, tense and markup issues were corrected. The
  earlier independent local audit missed several issues and is advisory only.
  Catalog snapshot 2c69227449fe5408b007661b8dd400387b8f7025140d9a49a6f2713b37c86f27
  is saved in src/i18n/en-US.json; there are zero pending source segments.
  The watcher --once path passes without making an inference request when no text
  changed. An initial sandbox EPERM was resolved by running the same bounded test
  with approved access to the existing Python runtime. An actual source-file change
  was detected by the background watcher, which completed a second refresh without
  inference because the probe introduced no public prose. The process and probe
  were removed after verification.
- Browser: English help/status output and project filtering work. Switching back
  to Spanish restores es-ES messages and separate terminal history. Desktop at
  1440px and Spanish mobile at 390px show no document overflow. At 320px the logo,
  language controls and terminal input fit their containers; navigation scrolls
  within its own row. English article navigation and its Spanish counterpart work.
  The checklist B variant renders its English label without submitting the form.
  No JavaScript errors were recorded; localhost analytics warnings are expected.
- Next: Verify the requested release on main and compare the public artifact with
  the local build. Local and remote main were rechecked at cecf7d0 before publication.
- Blocked: No technical implementation blocker. No commit, push or production
  deployment of this feature has occurred yet. Existing production is unchanged.
- Resolved during verification: terminal.js needed type=module; the project error
  renderer shadowed its translation helper; repeated builds duplicated language
  links; edited accepted translations were hidden in preview; old preview files
  survived route removal; Mermaid syntax was treated as prose; the privacy date
  changed every build. Final browser review also found slashless article links
  taking a preview redirect, untranslated inline interaction messages and a narrow
  terminal input. These were corrected and the routing regression test extended.
