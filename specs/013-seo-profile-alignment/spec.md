# SEO Profile Alignment

Status: Implemented

## Objective

On 2026-09-27 the owner asked to align search metadata with the profile set by
spec 012: full stack software architect, deterministic product conformance,
Python and .NET, and AI under human oversight.

## Requirements

- SEO-011: When the home page is built, its title shall read
  "NainDev | Aitor Nain · Arquitecto de Software Full Stack" and its
  description shall mention deterministic conformance, Python and .NET; neither
  shall read "Arquitectura Backend, 3D e IA".
- SEO-012: When any page is rendered, the Person structured data shall carry
  the job title "Arquitecto de Software Full Stack".
- SEO-013: When the blog and service hubs are built, their titles shall not read
  "Arquitectura Backend 3D e IA" and shall keep the NainDev suffix.

## Edge cases

- SEO-003 stays: the home title names both NainDev and the author.
- SEO-004 stays: titles and descriptions remain unique per page.

## Out of scope

- Titles and descriptions of individual blog posts and service pages.
- The social preview image.

## Session state

- Last updated: 2026-09-27
- Done: see `tasks.md`.
- Next: owner commit and deploy, then production check.
- Blocked: —
