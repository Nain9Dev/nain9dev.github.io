# Person dev.to profile

Status: In progress

## Objective

The owner's dev.to account `naindev` (formerly `nain9code`) carries his name, the NainDev site as website and a short bio, and now hosts a cross-post of the site's Clean Architecture article with the site as canonical URL. Listing it in the `Person` `sameAs` lets search engines tie that profile to the same entity as the site, the GitHub, GitLab and LinkedIn profiles.

## Requirements

- SEO-024: When any page is rendered, the `Person` `sameAs` shall also list `https://dev.to/naindev`, once.
- SEO-025: When any page is rendered, the `Organization` `sameAs` shall not list it (the profile is personal, as in SEO-019).

## Edge cases

- The old username `nain9code` redirects (301) to `naindev`, so only the current URL is listed.
- dev.to shows the AI disclosure level the owner chose for each post; this spec does not touch the posts.

## Out of scope

- Any change to the dev.to profile text or to the cross-posted article.

## Session state

- Last updated: 2026-11-21
- Done: spec, tests SEO-024 and SEO-025 (written first).
- Next: implementation, requirements, traceability, owner review.
- Blocked: —
