# Design Collaboration

## Scope

Let an external UI designer (David, GitHub `davidesuarez`) prepare redesign
proposals in the public repository without being able to change production.
The designer has no coding background. Aitor owns code, content and deployment,
and implements approved designs in `main`.

## Requirements

- DES-001: When a collaborator without the repository admin role pushes to,
  creates or deletes any branch outside `design/**`, the repository shall reject
  the operation.
- DES-002: When a collaborator creates or pushes a `design/**` branch, the
  repository shall accept it without affecting `main` or the deployed site.
- DES-003: The repository shall provide a design brief at `design/README.md`
  covering audience, positioning, current identity, constraints, workspace
  layout, handoff and branch rules, readable without coding knowledge.
- DES-004: The brief shall contain only information already public on
  naindev.com; it shall not include employers, dates, salary, identifiers or
  partnership terms.
- DES-005: When a design proposal is ready, the designer shall deliver a
  self-contained HTML/CSS prototype plus exports under `design/<topic>/`; the
  prototype shall open locally without a build step.
- DES-006: Production deployment shall remain restricted to `main`; a workflow
  started from a `design/**` branch shall not deploy to GitHub Pages.

## External dependencies and owner actions

- [H] Create the branch ruleset in GitHub (repository admin only). See plan.md.
- [H] Confirm David can push `design/test` and is rejected on `main`.
- [M] David installs GitHub Desktop and clones the repository.

## Non-goals

- Implementing the redesign in `src/`.
- Merging design branches into `main`.
- Restricting file paths inside `design/**` branches. The brief sets the rule;
  changes outside `design/` never reach `main` because design branches are not
  merged.

## Design direction (owner interview)

- DES-007: The first proposal shall cover the home page for mobile and desktop,
  prioritizing the mobile header menu and navigation.
- DES-008: Proposals shall keep the NainDev brand and logo colors `#0047AB`,
  `#00BFFF` and `#FFFFFF`; every other visual element may change.
- DES-009: Proposals may restructure sections and rewrite copy; final wording
  requires owner approval.
- DES-010: Mockups shall be delivered in Spanish and English.
- DES-011: Proposals shall not present unverified metrics, including the current
  "+50M" badge.
- DES-012: The owner shall provide a ready branch `design/home-redesign` with
  its folder, so the designer can upload through the GitHub web interface
  without installing tools or creating branches.

## Business context (owner interview, second round)

- DES-013: The brief shall state that the delivered visual design is authored by
  David and credited on the published site in the form he chooses, while
  software, code and functionality remain the owner's, and that uploaded files
  are public.
- DES-014: The brief shall state the business goals (win clients for custom
  software services and improve SEO) and leave message hierarchy and main call
  to action to the designer.
- DES-015: The brief shall require keeping the blog, service pages, technology
  pages and interactive terminal, and exclude case studies from the design.
- DES-016: The brief shall include SEO rules for the design (real text, one H1,
  per-service pages, stable URLs, performance budget) and a FAQ for a designer
  without coding knowledge.
- DES-017: The brief shall list `contact@naindev.com` as the public email, and
  WhatsApp only as a chat button without a visible phone number. The phone
  number shall not be stored in the repository until the site implementation
  adds the chat link.
- DES-018: The brief shall describe the Contrast3D x NainDev partnership, allow
  an optional partners section and a Contrast3D design credit at the designer's
  discretion, and forbid presenting shared clients or joint projects.
