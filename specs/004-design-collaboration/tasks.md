# Design Collaboration Tasks

- [x] [A] Inspect repository access, rulesets, environments and workflow permissions.
- [x] [A] Specify access model, brief content and privacy boundary.
- [x] [A] Write the design brief in `design/README.md`.
- [x] [A] Record owner interview decisions in the brief (DES-007 to DES-011).
- [x] [H] Create the `protect-non-design-branches` ruleset (DES-001, DES-002). Approved by owner; id 23551316.
- [ ] [M] Verify rejected and accepted pushes as `davidesuarez` (plan.md, Verification).
- [ ] [H] Share the brief link with David.

## Handoff

- Done: Brief, spec and active ruleset `protect-non-design-branches` (id 23551316).
- Verified: Repository is public. `davidesuarez` has `write`. Before the ruleset, `main` had no
  branch protection or rulesets, so David could push to `main` and
  trigger a production deploy. `github-pages` environment is limited to `main`.
  Default workflow permissions are read-only. No repository secrets are listed.
- Next: Run the verification steps with the `davidesuarez` account.
- Blocked: Access checks need David to push from his own account.
