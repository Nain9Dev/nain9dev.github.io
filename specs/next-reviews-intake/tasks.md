# Tasks: Invite-only review intake

Labels: `[A]` agent alone, `[M]` mixed, `[H]` owner only. One task at a time, test first.

- [x] **T-001** `[A]` Worker handler with in-memory tests (REV-001 to REV-007). Done when: `node --test services/reviews/test/*.test.mjs` passes, covering invitation, single use, expiry, honeypot, limits, rate limit, admin auth and CORS.
- [x] **T-002** `[A]` CLI `invite` and `pull` with injected fetch (REV-008). Done when: `scripts/testimonial-cli.test.mjs` covers both and nothing is published by `pull`.
- [x] **T-003** `[A]` Request page form behind `PUBLIC_REVIEWS_ENDPOINT` with email fallback (REV-009). Done when: build with and without the variable renders the right variant and tests pass.
- [x] **T-004** `[A]` CSP origin added only when the variable is set (REV-010). Done when: a test checks both builds.
- [x] **T-005** `[A]` Runbook: setup, secrets, rotation, recovery (REV-011). Done when: `docs/06-runbook/review-intake.md` exists and the testimonials runbook links it.
- [x] **T-006** `[A]` Draft the privacy policy section (not published yet). Done when: the text is in `docs/06-runbook/review-intake.md` and a test blocks enabling the endpoint in the deploy workflow before B-021. Result: draft written; `scripts/reviews-page.test.mjs` fails if `PUBLIC_REVIEWS_ENDPOINT` appears in the workflow (update that test when the owner enables it).
- [ ] **T-007** `[H]` Create the Worker, the KV namespace and the route in Cloudflare (B-018, B-019). Done when: `curl -sI https://<endpoint>/v1/health` answers 200.
- [ ] **T-008** `[H]` Set the admin secret and `REVIEWS_ENDPOINT`, `REVIEWS_ADMIN_TOKEN` locally (B-020). Done when: `npm run testimonial -- invite "Test" --relationship partner` returns a link.
- [ ] **T-009** `[H]` Approve the privacy policy text (B-021), then enable `PUBLIC_REVIEWS_ENDPOINT` in the deploy workflow. Done when: the production request page shows the form for a valid link.
- [ ] **T-010** `[M]` End-to-end test with a real invitation to Contrast3D. Done when: a pending entry arrives through `pull` and is approved or discarded by the owner.
