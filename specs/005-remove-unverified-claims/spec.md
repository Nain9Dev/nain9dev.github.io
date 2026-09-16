# Remove Unverified Claims

## Scope

The owner confirmed that the "+50M models validated/processed" figure is not a
verified figure. Remove it from every published page in both locales and
prevent it from returning. Other claims awaiting owner verification are tracked
in `docs/11-open-questions.md` and are out of scope here.

## Requirements

- CLM-001: When the site is built, the system shall not publish the unverified
  claim "+50M" in any Spanish or English HTML page.
- CLM-002: When a source component or page reintroduces a blocked claim, the
  project validation command shall fail and name the file.

## Affected content

| File | Content |
| :--- | :--- |
| `src/components/home/Hero.astro` | Trust badge "+50M Modelos / Validados en Producción" |
| `src/pages/recursos/gracias.astro` | Badge "+50M modelos procesados" |
| `src/i18n/en-US.json` | English translations of both badges |

## External dependencies and owner actions

- [H] Owner decision recorded in chat on 2026-09-16: do not use the figure.
- [A] No external services required.

## Non-goals

- Changing any other metric or badge.
- Editing private, git-ignored marketing drafts under `src/content/marketing/`.
