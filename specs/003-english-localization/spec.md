# English Localization

## Scope

Spanish from Spain remains the official editorial source. Add formal, natural
American English under `/en/` on the existing domain and static hosting.
Preserve Spanish URLs, content, brand assets and existing index policies.

## Requirements

- LOC-001: When building the site, the system shall produce separate Spanish and
  English HTML pages from one Spanish source and a versioned translation catalog.
- LOC-002: When source prose changes, the system shall require a matching reviewed
  translation before completing a release build; it shall never silently reuse
  an unrelated or stale translation.
- LOC-003: The system shall preserve markup, executable code, protected literals,
  resource URLs, form destinations and technical identifiers during translation.
- LOC-004: Each translated page shall have a self canonical, reciprocal language
  alternates, localized metadata/structured data and an equivalent-page switcher.
- LOC-005: English navigation and interactive content shall use English text and
  corresponding English internal destinations, with separate terminal history.
- LOC-006: English shall be rendered before delivery without runtime inference,
  browser translation, external translation requests or a new hosted backend.
- LOC-007: Local translation generation shall write reviewable proposals only,
  preserve prior accepted translations and expose failures without approval bypass.
- LOC-008: Release validation shall verify both locales, translation coverage,
  routes, language alternates, sitemap, assets and source integrity.
- LOC-009: Translation requests shall include only extracted public prose, locale,
  protected placeholders and editorial context; generated executable markup shall
  not be accepted as translation data.

## External dependencies and owner actions

- [A] Existing Node, Astro and parse5 are sufficient for deterministic builds.
- [A] Optional NainWrite source and local Python/Ollama are needed only to generate
  and audit new drafts; no cloud inference or paid service. The adapter uses the
  loopback client, not the full document-rewriting workflow or LanguageTool.
- [A] Review the initial English catalog and resolve observed structural and
  editorial findings before release. Catalog review is not owner certification.
- [M] Future generated proposals require editorial review before acceptance;
  unsupported commercial claims require owner evidence, in either language.
- [H] No domain purchase, account creation, credentials or billing changes needed.
- [A] Public release uses the existing GitHub Pages workflow after authorized review.
- [M] Google crawl/indexing and editorial quality remain separate acceptance evidence.

## Acceptance boundaries

Automated checks establish structural consistency, not perfect semantic fidelity.
Existing newsletter configuration and commercial claims remain outside this feature.

## Verification mapping

| Requirement | Evidence |
| --- | --- |
| LOC-001, LOC-002, LOC-006, LOC-007 | Localization CLI integration test; full build; changed-source watcher smoke check |
| LOC-003, LOC-009 | Placeholder, literals, markup and protected-code unit tests; local adapter inspection |
| LOC-004, LOC-008 | SEO and localization contracts; comparison of deployed pages and assets with the built artifact |
| LOC-005 | Interface key checks; browser filters, terminal, article switching, checklist variant and mobile layout |
