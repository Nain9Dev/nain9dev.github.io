# Tasks

Consolidated task index. Feature-level detail and handoff state live in `../specs/NNN-*/tasks.md`; this file does not duplicate completed items.

## Feature task files

| Spec | Task file | State | Open `[M]`/`[H]` items |
| :--- | :--- | :--- | :--- |
| 001 Brand favicon indexing | [tasks.md](../specs/001-brand-favicon-indexing/tasks.md) | Done | None |
| 002 Search brand presentation | [tasks.md](../specs/002-search-brand-presentation/tasks.md) | Done, one follow-up open | 1 |
| 003 English localization | [tasks.md](../specs/003-english-localization/tasks.md) | Done | None |
| 004 Design collaboration | [tasks.md](../specs/004-design-collaboration/tasks.md) | Blocked on external access check | 2 |
| 005 Remove unverified claims | [tasks.md](../specs/005-remove-unverified-claims/tasks.md) | Committed (`c78c854`); production confirmation open | None (`[A]` production check open) |
| 006 Remove unverified metrics | [tasks.md](../specs/006-remove-unverified-metrics/tasks.md) | Done | None |
| 007 Remove case studies | [tasks.md](../specs/007-remove-case-studies/tasks.md) | Implemented, not committed | 1 (owner review and commit) |

## Open human-dependent tasks

- [ ] **T-001** `[M]` Inspect the public home URL in Search Console and request recrawling once, when separately authorized.
  - **Covers**: SEO-003, SEO-004
  - **Spec**: specs/002-search-brand-presentation
  - **Done when**: the request acceptance is recorded in the spec 002 handoff, separately from any later refreshed search result.
- [ ] **T-002** `[M]` Verify pushes as `davidesuarez`: `design/access-check` accepted; push to `main` and creation of `feature/x` rejected; owner push to `main` still accepted.
  - **Covers**: DES-001, DES-002
  - **Spec**: specs/004-design-collaboration
  - **Done when**: all four verification steps in `specs/004-design-collaboration/plan.md` are recorded with their outcome.
  - **Needs from owner**: the designer pushes from his own account.
- [ ] **T-003** `[H]` Share the design brief link with the designer.
  - **Covers**: DES-003
  - **Spec**: specs/004-design-collaboration
  - **Done when**: the owner marks the item done in the spec 004 task file.

## Open questions requiring owner decisions

- [x] **T-004** `[H]` Resolve OQ-001 to OQ-006 (unverified homepage claims): provide evidence, reword or remove each.
  - **Covers**: DES-011, CLM-001
  - **Spec**: docs/11-open-questions.md
  - **Done when**: every OQ entry has status `Resolved` with the decision recorded, and any removal has a matching `CLM-` requirement and check.
- [x] **T-005** `[H]` Decide OQ-007 (public constitution) and approve or reject ADR-0001.
  - **Covers**: ADR-0001
  - **Spec**: docs/30-decisions/ADR-0001-spec-driven-documentation.md
  - **Done when**: ADR-0001 status is `Approved` or `Superseded`.
- [ ] **T-006** `[H]` Confirm whether the Cloudflare cache purge secrets exist (B-003).
  - **Covers**: deployment runbook
  - **Spec**: docs/41-blockers.md
  - **Done when**: B-003 is marked verified or the purge step is redesigned under a new spec.
  - **Deferred**: owner decision 2026-09-16; handle later together with MailerLite (B-007) and the README Astro version badge.
- [x] **T-008** `[M]` Review the spec 007 redirect targets and wording assumptions, then commit and deploy.
  - **Covers**: CASE-001 to CASE-008
  - **Spec**: specs/007-remove-case-studies
  - **Done when**: the change is committed, deployed and the production redirects are recorded in the spec 007 handoff.
  - **Needs from owner**: approval of the assumptions in `plan.md` and the commit.
- [ ] **T-009** `[H]` Decide the public professional contact email (B-013) and create the WhatsApp Business number (B-014).
  - **Covers**: future contact channel work
  - **Spec**: docs/41-blockers.md
  - **Done when**: B-013 and B-014 are marked verified; any site change gets its own spec.
- [ ] **T-007** `[H]` Decide OQ-008 (availability and zero-downtime wording in service pages and blog posts).
  - **Covers**: content integrity
  - **Spec**: docs/11-open-questions.md
  - **Done when**: OQ-008 is resolved and any change has its own spec.
