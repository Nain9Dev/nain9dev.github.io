# Catalog Complexity Ordering & Enhanced Filters

Status: In progress

## Objective

On 2026-10-03 the owner approved reordering the project catalog by complexity and impact, placing the production triad at the top, followed by enterprise .NET architectures, parametric CAD, procedural 3D engines, local AI pipelines, and training projects at the end. In addition, the filtering system is upgraded to strategic domain axes ('Todos', 'Producción', '.NET / C#', 'Python & Datos', '3D', 'Demos') with dynamic count badges for each category.

## Requirements

- PRJ-008: Projects in `public/assets/data/projects.json` shall be ordered sequentially (0 to 18) by maturity and complexity hierarchy:
  1. Production ecosystem (conformance architecture, interactive 3D viewer, collaborative CRM).
  2. Enterprise .NET architectures, parametric CAD & critical backend.
  3. Procedural 3D game engines (custom ECS, continuous collision physics).
  4. Local AI pipelines & tooling.
  5. Training projects & in-planning simulators at the end.
- PRJ-009: `public/assets/js/project-catalog.js` and `public/assets/data/projects.json` shall support the strategic category set `["backend", "data", "demo", "3d", "production", "dotnet", "python"]`.
- UI-001: The filter toolbar shall provide buttons for `all`, `production`, `dotnet`, `python`, `3d`, and `demo`. Each button shall display a dynamic count badge matching the actual number of projects in that category.
- LOC-011: All filter labels shall be localized with reviewed translations in `src/i18n/en-US.json`.

## Approved Ordering (0 to 18)

0. `conformance-architecture` (Conformidad determinista, Producción)
1. `interactive-3d-viewer` (Visor 3D Web Component, Producción)
2. `collaborative-crm` (CRM colaborativo multiusuario, Producción)
3. `parametricad-ai` (ParametriCAD AI, CAD B-Rep, Demo)
4. `financial-management-api` (API de Operaciones de Pólizas, Demo)
5. `nainorder-ecommerce-api` (NainOrder, Clean Architecture & DDD, Demo)
6. `notification-worker` (Microservicio asíncrono RabbitMQ)
7. `nainconfigurator` (Configurador B2B dirigido por catálogo)
8. `driving-school-management` (Facturación determinista en memoria, Demo)
9. `tai-study-system` (Simulacros de oposición TAI, Demo)
10. `self-hosted-ci-runners` (Flota local de runners CI)
11. `orbe-runner-3d` (Runner 3D procedural con ECS, Demo)
12. `pong-arcade` (Pong 3D con colisiones continuas, Demo)
13. `b2b-prospecting-pipeline` (Pipeline B2B con LLM)
14. `local-rewriting-agent` (Agente local de reescritura)
15. `local-quotation-generator` (Generador de presupuestos)
16. `gamehaven-blazor-store` (GameHaven, Proyecto de formación, Demo)
17. `havetickets` (HaveTickets, Proyecto de formación)
18. `driving-exam-simulator` (Simulador de conducción 3D, En planificación)

## Session state

- Last updated: 2026-10-03
- Done: interview aligned with owner, spec created.
- Next: test assertions, catalog reordering, UI update, translations and verification.
- Blocked: —
