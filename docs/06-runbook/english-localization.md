# English localization

Spanish from Spain is the official source. The same site serves American English
under `/en/`, with shared components, assets and hosting. No additional domain,
translation account or paid API is required.

## Build and deployment

```sh
npm ci
npm run check
npm run preview
```

The build generates Spanish HTML with Astro, then generates English documents
from the versioned `src/i18n/en-US.json` catalog. CI runs all checks before uploading
the Pages artifact. A missing, changed or draft translation stops the release.
Neither CI nor the public website contacts an inference service.

Spanish addresses remain unchanged. English hubs use `/en/services/`,
`/en/case-studies/`, `/en/blog/`, `/en/resources/`, `/en/technology/` and
`/en/privacy/`. Existing detail slugs are retained under those hubs. Each indexable
pair has self canonicals and reciprocal `es`, `en` and `x-default` alternatives.
Spanish is the default. There is no browser-language or IP-based redirect.

## Edit the Spanish source

Edit the existing Astro/MDX pages and public data. Put new interactive messages
in `src/i18n/runtime.json` and use the `message()` helper in client code. New JSON
prose fields must be added to `mapData()` and covered by the localization contract.
Code examples, Mermaid source, resource URLs and form destinations are preserved.
Use `translate="no"` for an immutable inline identifier.

Keep publication dates in source control. Change the explicit privacy-page
`updatedAt` only when updating that page; do not replace it with the build date.

Astro dev is the Spanish authoring environment. Use a full build and preview to
inspect English, because localization runs after Astro has rendered the pages.

## Generate changed translations locally

Prerequisites are an existing NainWrite checkout, its Python dependencies, an
installed Ollama model and Ollama listening only on loopback. This feature does not
install models, start persistent services or modify NainWrite. If generation is
unavailable, the previous production release remains live.

PowerShell example (session variables only):

```powershell
$env:NAINWRITE_ROOT = 'D:\Development\Personal-Projects\NainWrite'
$env:NAINWRITE_PYTHON = 'C:\Users\aitor\AppData\Local\Programs\Python\Python312\python.exe'
npm run translations:watch
```

While this command runs, source changes are debounced and processed sequentially:
build Spanish, extract current prose, generate changed proposals, write the review
report. Stop it with Ctrl+C. It never commits, pushes, accepts or deploys proposals.
Run `npm run translations:generate` for one bounded update using the same settings.

Manual equivalent, including an optional model override:

```powershell
npm run translations:prepare
& $env:NAINWRITE_PYTHON -B scripts/translate-local.py --model gemma4:latest
npm run translations:review
```

The Python adapter imports only NainWrite's loopback Ollama client. It uses a
website-specific prompt and JSON output contract; it does not run the full
Markdown/TXT rewrite workflow or LanguageTool. Only extracted public website
prose is supplied. Spanish is never rewritten automatically.

## Review and accept a specific snapshot

Drafts and generation evidence are ignored files under `.astro/translations/`.
`review.md` pairs Spanish with English, affected pages and structural findings.
Corrections can be entered in `edits.json` as
`{ "segment-id": { "source": "Exact Spanish source", "target": "English text" } }`.
Re-run `npm run translations:review` after editing.

An optional independent local semantic audit is available:

```powershell
& $env:NAINWRITE_PYTHON -B scripts/audit-translations-local.py
```

Check actors, negation, tense, conditions, figures, claims and natural wording.
The advisory audit has missed real errors; an empty findings array is not proof
of equivalence. Preserve names, email addresses, currencies and technical syntax.
Review ASCII diagram alignment explicitly. Do not strengthen business claims.

```sh
npm run translations:preview
npm run translations:serve
```

This separate loopback preview uses `.astro/localized-preview`, `noindex` and a
blocking robots file. It does not alter the approved catalog or the public site.
It supports reviewing corrections to previously accepted translations as well as
new text. Rebuild and reload after a change.

After reviewing the exact report, copy its snapshot hash:

```sh
node scripts/review-translations.mjs --accept REVIEWED_SNAPSHOT_HASH
npm run check
```

The command rejects a stale hash or unresolved structural findings. `reviewed`
means that this explicit catalog snapshot was accepted; it is not an assertion
that the owner certified every sentence or that semantic quality is perfect.
Commit the Spanish changes and accepted catalog together through the authorized
release process. Generation and publication are deliberately separate steps.

## Verification and recovery

The tests exercise missing and draft entries, stale approval hashes, markup
escaping, numbers and contacts, protected code, repeated builds, preview isolation
and removed preview routes. The complete site contract checks both languages,
internal links, sitemap/index policy, metadata, structured data and brand icons.
Browser checks must also cover filters, terminal output, the language selector,
an article and narrow screens after client navigation.

After GitHub Pages has deployed the checked commit, run
`node scripts/check-production.mjs`. It performs read-only GET requests and compares
page language, headings, main text, metadata, structured data and interface messages
with `dist`, and checks hashes for static assets. Evidence is written to the ignored
`.astro/production-verification.json`. This requires network access and a current
bilingual build; it is intentionally separate from the offline CI contract.

If an update fails, fix the source/catalog pair and rebuild. Never label a draft
as reviewed merely to make CI pass. To roll back a published change, revert its
commit through the normal authorized workflow and verify the resulting public
artifact. No database or migration is involved.

Google controls recrawling, indexing, snippets, favicon selection and rankings.
Successful checks or deployment do not establish a search ranking or a perfect
SEO score. Existing newsletter delivery, analytics claims and commercial metrics
require their own evidence and are not validated by localization.

## References

Consulted for this implementation on 2026-09-08:

- [Google: multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Astro: internationalization](https://docs.astro.build/en/guides/internationalization/)
- [Astro: routing](https://docs.astro.build/en/guides/routing/)

Feature requirements and decision record: `specs/003-english-localization/`.
