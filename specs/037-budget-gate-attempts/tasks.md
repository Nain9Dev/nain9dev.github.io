# Tasks: Budget gate attempts

- [x] **T01** `[A]` Diagnose the intermittent TBT failures from the deploy logs and a local trace.
  - **Result**: see the Diagnosis section of `spec.md`.
- [x] **T02** `[A]` Test first: attempts policy and per-attempt logging.
  - **Covers**: LHCI-002, LHCI-003
  - **Result**: `scripts/measurement.test.mjs` test "LHCI-002: …"; red before (missing exports), green after.
- [x] **T03** `[A]` Implement `ATTEMPTS` and `settleAttempts`, and run each attempt in a fresh Chrome in `scripts/check-budget.mjs`.
  - **Covers**: LHCI-002, LHCI-003
- [x] **T04** `[A]` Record ADR-0006 (Proposed) and consolidate requirements, traceability and changelog.
- [ ] **T05** `[H]` Owner approves ADR-0006 and authorizes rerunning the deploy of 28f6551.
- [ ] **T06** `[A]` After the rerun: confirm the Organization node in the live JSON-LD (spec 036).
