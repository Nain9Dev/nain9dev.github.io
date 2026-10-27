# ADR-next: The hero ends with receipts the visitor can check, not with claims

Status: Proposed
Date: 2026-10-27

## Context

The site removed every unverified metric in 2026 (specs 005 and 006, CLM-001 to CLM-006) and keeps a check that fails the build when a blocked claim returns. The home then relied on adjectives ("fiable", "verificable") and, until spec 049, on a strip of three generic proof sentences that said how the owner works without letting anyone check it; that strip left the home (HN-005). ADR-0015 kept a "verifiable receipts" strip as a candidate once the selected work existed, noting that it proves craft rather than client outcomes. The selected work (spec 049) and the work pages (spec 050) now carry the outcomes; the first screen still has nothing a technical buyer can verify without scrolling.

The repository already produces the receipts: it is public, two GitHub Actions workflows run the whole validation and the Lighthouse budget on every pull request and every push to `main`, every deploy is a commit, and the services have a public status monitor. None of this is shown on the home.

## Decision

- The hero ends with a band of four receipts: the site's source repository, the checks on every change, the commit that produced the page (identifier and date, resolved at build time) and the public status monitor. Each is a plain link; the visitor verifies by following it.
- A receipt is a fact of the repository or the address of the page that shows the fact. No score, count, percentage or duration is printed: Lighthouse scores vary by host, test counts mean nothing to a buyer, and both would be claims to maintain by hand. The commit identifier and its date are the only figures, and they come from git.
- The band requests nothing from a third party. A live CI badge or a live status dot would send every visitor's address to GitHub or to the monitor on load, against the footer's promise; the links do the same job on the visitor's own decision.
- The band lives inside the hero component, so the home keeps its ten sections (HN-001) and the hero keeps its reading order; it closes the hero under the copy and the panel, before the selected work.

## Consequences

- The home document changes with every commit (seven characters). Nothing compares builds across commits; the size tripwire is unaffected.
- A build outside a git checkout fails on purpose: the site is never published without saying which commit it is.
- `main.css` grows by about 0.6 KB raw; the home stays under the CSS-002 tripwire, measured in `specs/next-receipts-strip/tasks.md`.
- The receipts prove how the site itself is built and run, not outcomes for a client; the selected work and the work pages keep that role.

## Alternatives considered

- **Live badges (GitHub Actions badge, status badge image)**: a third-party request on every visit and a dependency on the badge host's availability; rejected for RC-004.
- **Printed scores (Lighthouse 0.99, axe 0, N tests)**: hand-maintained claims that drift from the measurement; rejected for RC-003 and the spirit of CLM-001.
- **A new section between the selected work and the services**: changes HN-001 and the guards that encode it; the band belongs to the first screen anyway.
- **Build date instead of commit date**: not reproducible for the same commit and says nothing a visitor can check; the commit date is verifiable on the linked page.
