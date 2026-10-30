# Tasks: A /proyectos/ catalog and product bridges to DSE and Contrast Viewer

- [x] **T01** `[H]` Owner interview: home selection, the six projects, the 3D bridge, destinations, product sites, viewer address, DSE indexing (2026-10-29).
- [ ] **T02** `[H]` Create the Cloudflare Pages project and the DNS record for `viewer.contrast3d.com` (B-022). Blocks only the viewer link of NPR-005.
- [x] **T03** `[A]` Catalog page and its English twin (NPR-002), guard first. Pull request #52.
- [ ] **T04** `[A]` Home selection (NPR-001): six featured projects and the link with the count; the filter bar leaves the home.
  - **Done when**: home document under 28 824 B gzip.
- [x] **T05** `[M]` Products band and 3D bridge (NPR-003 to NPR-007). Band texts approved on 2026-10-29 and delivered in #55; catalog bridge, hero and service sentences and the Nain3D note approved the same day (this change). The two application projects tagged 3D (`nainconfigurator`, `driving-exam-simulator`) stay in the catalog; Nain3D and ParametriCAD stay as selected work.
  - **Side effect**: COPY-009 and the confidential-name guard of `profile-coherence.test.mjs` forbade the name DSE in public copy; they are amended (the identifiers E3C and RT-nnn stay forbidden).
- [ ] **T06** `[A]` Consolidate NPR-001 to NPR-007 in `docs/10-requirements.md` and `docs/50-traceability.md` when the steps are merged.
- [ ] **T07** `[A]` Contrast Viewer public site (NPR-007): own specification in the viewer's organization, cloned from the DSE `web/` generator, public material only (survey of 2026-10-29: six thumbnails in `demo/parts-demo-thumbs`, the benchmark and integration docs, no client names, no hostnames). Needs T02 to go live.
- [ ] **T08** `[M]` Lift the DSE `noindex` (meta, `_headers`, `robots.txt`, add a sitemap) in the DSE repository. The owner decided it on 2026-10-29; the DSE web worktree is reserved by another session (`D:/wt/CLAIMS.md`, `chore/web-landing-fixes`), so it waits for that session to finish.

## Session log

- 2026-10-29 · Interview answered by the owner, including the product-site direction (D5 to D8). A read-only survey of the DSE, Contrast Viewer and Contrast Hub repositories supports it: DSE already has a static bilingual site, the viewer has only a gated demo, the Hub stays private. Next: T04 once #52 is merged.
