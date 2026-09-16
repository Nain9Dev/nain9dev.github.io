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
