# Tasks: Installable site (Android and iOS)

One task at a time, test first. Stop after each task. Update the `Session state` block in `spec.md` after closing each one.

- [x] **T01** `[A]` Write `scripts/pwa-install.test.mjs` and add it to the post-build group of `npm run check`.
  - **Covers**: INS-007
  - **Done when**: the test fails on the current tree because the manifest, the icons and the tags are missing.
  - **Result**: failed with `ENOENT public/manifest.webmanifest` before the implementation.
- [x] **T02** `[A]` Generate the install icons and extend the icon check.
  - **Covers**: INS-003, INS-004, INS-005
  - **Done when**: `npm run generate:brand-icons` writes the three files and `npm run check:brand-icons` passes
    and fails when one of them is replaced.
  - **Result**: `scripts/lib/install-icons.mjs` is shared by the generator and the check. The maskable mark is
    scaled to .66, which ends its round caps at 36% of the width from the centre.
- [x] **T03** `[A]` Add `public/manifest.webmanifest` and the head tags in `BaseLayout.astro`.
  - **Covers**: INS-001, INS-002, INS-006
  - **Done when**: `scripts/pwa-install.test.mjs` passes on a fresh build and `npm run check` passes.
  - **Result**: the first run caught the English build rewriting the link to `/en/manifest.webmanifest/`;
    `englishPath` now leaves `.webmanifest` files at the root (`scripts/localization.test.mjs`). The 28 redirect
    stubs carry no layout and are excluded from the page rule. `npm run check` passes.
- [x] **T04** `[A]` Ask Chrome for installability errors on a local preview and record the result.
  - **Covers**: acceptance criteria
  - **Done when**: `Page.getInstallabilityErrors` returns an empty list for `/` and `/en/`.
  - **Result**: headless Chrome over the DevTools protocol on a loopback copy of `dist/`: manifest parsed, no
    error on `/`, `/en/` and `/servicios/`. The same probe on the live site before the change answers
    `no-manifest`, and no error on the three hosts that were already installable.
- [ ] **T05** `[M]` Verify the live site after the deploy.
  - **Covers**: acceptance criteria
  - **Done when**: the live manifest answers 200 with a manifest media type and the owner has installed the
    site on Android and on iOS.
  - **Needs from owner**: merge the pull request, then install from Chrome on Android and from Safari on an
    iPhone and confirm icon, label and window.
