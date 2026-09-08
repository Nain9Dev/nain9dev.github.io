# ADR-001: Localize the generated static document

Status: Proposed

## Decision

Use a deterministic HTML-aware build step with a content-addressed translation
catalog. Spanish Astro/MDX remains authoritative. Extract prose at semantic block
boundaries and represent embedded markup with immutable numbered placeholders.
Share assets and explicitly localize interactive data. Inference remains optional
local tooling, never part of public hosting or CI.

## Rationale

The existing site mixes Spanish Astro literals, MDX and client-loaded JSON.
Maintaining a second tree would introduce drift; translating source files would
expose executable syntax to generation. Parsing final HTML reuses the current
templates and captures new visible prose regardless of its original file.

## Consequences

English previews require the complete build and preview command. Astro dev remains
the Spanish authoring environment. The localization step owns English routes and
the final combined sitemap. Tests must cover script/attribute preservation and
client navigation, not just translated text. This decision does not approve any
generated editorial candidate.
