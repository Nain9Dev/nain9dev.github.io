# Profile Coherence

Status: Implemented

## Objective

On 2026-09-27 the owner aligned GitHub and LinkedIn with his current stack and
roles. The site must tell the same story: multi-domain deterministic
conformance, Python and .NET at the same level, the full-time .NET role
described without naming the employer, and a project catalog that lists every
project he built, with private ones described by architecture and stack only.

## Requirements

- COPY-010: When the home page is built, the hero shall present deterministic
  product conformance with 3D as the first domain, and shall not claim
  "escala industrial".
- COPY-011: When the home page is built, the hero stack line shall list Python,
  C#, FastAPI, .NET, PostgreSQL, SQL Server, Vue 3 and MCP.
- COPY-012: When the home page is built, no badge shall present a self-assigned
  title as market validation (no trophy "Arquitecto .NET" badge, no
  "Validación de mercado" label).
- COPY-013: When the tech stack section is built, it shall list the default
  stack: Python, C#, TypeScript, FastAPI, Pydantic, .NET, Vue 3,
  Tailwind CSS, Astro, PostgreSQL, SQL Server, MCP, Docker and GitHub Actions,
  each with an existing icon file.
- COPY-014: When the terminal `experience` command is served, it shall describe
  the full-time role as ".NET developer in the insurance sector" with its
  verified stack (.NET Framework, ASP.NET MVC 5, ASP.NET Web API 2, SQL Server,
  Dapper) and shall not name the employer or attribute ASP.NET Core to it.
  `stack` shall list the default stack by area.
- PRJ-001: When the project catalog is served, it shall list every public
  project of the owner and the private projects he approved, and every entry
  shall keep the catalog schema.
- PRJ-002: When a catalog entry is private, it shall carry `"private": true`,
  have no links, show that its code is private, and shall not contain product
  names, client or partner names, employer names or internal identifiers.
- PRJ-003: When the catalog is built, it shall not contain unverified
  performance figures (latency, "latencia cero", sub-millisecond claims).

## Private projects approved on 2026-09-27

Conformance architecture, collaborative CRM, B2B prospecting pipeline,
local Spanish rewriting agent, local quotation and invoice-draft generator,
self-hosted CI runner fleet, 3D driving-exam simulator (in planning).

## Out of scope

- Service pages and blog posts.
- Case studies (removed by spec 007).
- The About section (spec 011).

## Acceptance criteria

- `npm run check` passes with the new tests.
- English pages and data read reviewed translations.

## Session state

- Last updated: 2026-09-27
- Done: see `tasks.md`.
- Next: owner commit and deploy, then production check.
- Blocked: —
