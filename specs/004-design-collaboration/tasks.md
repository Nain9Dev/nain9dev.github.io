# Design Collaboration Tasks

- [x] [A] Inspect repository access, rulesets, environments and workflow permissions.
- [x] [A] Specify access model, brief content and privacy boundary.
- [x] [A] Write the design brief in `design/README.md`.
- [x] [A] Record owner interview decisions in the brief (DES-007 to DES-011).
- [x] [A] Create `design/home-redesign` with a proposal template and document the web upload flow (DES-012).
- [x] [A] Add business goal, authorship and credit, SEO rules, contact channels and FAQ to the brief (DES-013 to DES-017).
- [x] [H] Provide the public email address and WhatsApp Business number (DES-017). Number kept outside the repository.
- [x] [A] Add partnership context, email and WhatsApp button rules to the brief (DES-017, DES-018).
- [x] [A] Add markets, client problems, offer, pricing, availability, testimonials and checklist decisions to the brief (DES-019).
- [x] [A] Authorize logo redesign and add trademark-ready logo rules and deliverables to the brief (DES-020).
- [x] [A] 2026-09-21: Designer reported he could not commit. Verified on GitHub: `write` role, ruleset excludes `design/**`, no rejected pushes logged, no push from him yet, so the block is local. Added explicit commit authorization and troubleshooting to the brief (DES-022) and merged `main` into his branch.
- [ ] [H] Before filing the trademark, obtain a written assignment of the logo's rights from the designer and run an OEPM/TMview similarity search.
- [ ] [H] Send a test message to `contact@naindev.com` and confirm delivery (MX records point to Cloudflare Email Routing; delivery not verified).
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
