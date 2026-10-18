# Services index grouped by client problem

Status: In progress

## Objective

The services index lists 15 pages ordered by an internal number and titled by technology. A CTO arriving with a problem cannot tell which page is theirs. Group the same pages by the problem a client brings, without creating, renaming or removing any service URL (owner decision 2026-10-18: reorder the index, no new landing pages yet).

## Requirements

- SVC-001: When the services index is rendered, it shall group the published services under H2 headings phrased as the client's problem, with the service cards (H3) inside each group.
- SVC-002: Every published service shall appear exactly once in the index; a service not assigned to a group shall appear under a fallback group so none is lost.
- SVC-003: The page shall keep its single H1 and its call-to-action ("Agendar llamada gratuita").
- SVC-004: Service URLs, titles and descriptions shall not change.
- SVC-005: Group headings shall state problems, not results: no figures, guarantees or availability promises (see COPY-005).
- SVC-006: Every new Spanish string shall have a reviewed English translation.

## Groups (owner-approved structure, wording mine)

1. Mi backend es lento o no aguanta la carga: `optimizacion-rendimiento-apirest-dotnet`, `sistemas-criticos-dotnet`, `backend-critico-logistica`.
2. Tengo un sistema legacy difícil de cambiar: `auditoria-sistemas`, `migracion-monolito-microservicios-ia`.
3. Quiero usar IA, pero no puedo fiarme de ella: `arquitectura-ia-generativa`, `arquitectura-ia-escalable`, `arquitectura-ia-fintech`, `arquitectura-ia-generativa-startups-saas`.
4. Tengo modelos 3D que procesar o validar a escala: `validacion-3d`, `optimizacion-carga-3d`, `backend-escalable-modelos-3d-azure`, `sistemas-validacion-geometrica-nube`, `procesamiento-3d-healthcare`.
5. Mi frontend o mi web va lento: `arquitectura-frontend-alto-rendimiento`.

## Edge cases

- A new service added to the collection without a group is rendered under "Otros servicios", and the test fails until it is assigned, so the omission is visible.
- Draft services stay excluded.

## Out of scope

- New landing pages, title or description rewrites, duplicated content between AI and 3D pages (candidate for a later consolidation spec).

## Session state

- Last updated: 2026-10-18
- Done: tests (`scripts/services-by-problem.test.mjs`, registered in `npm run check`), grouped index in `src/pages/servicios/index.astro`, 5 reviewed English titles, `npm run check` green (astro check included), verified in the browser (ES and EN: 5 groups, 15 cards, one H1). Not committed.
- Next: owner review and commit.
- Blocked: —
