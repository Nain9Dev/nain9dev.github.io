# Organization Structured Data

Status: Implemented (local checks pass; not committed or deployed)

## Objective

On 2026-10-15 the owner asked to improve the search presence of the NainDev
brand and supplied the website, GitHub and GitLab profile URLs. The structured
data described only a `Person`; the brand existed as an `alternateName` and the
company LinkedIn page was attached to the person. Search engines therefore had
no brand entity to connect to its profiles.

## Requirements

- SEO-014: When any page is rendered, the structured data shall describe NainDev
  as an `Organization` with the stable identifier `<origin>/#organization`, the
  name "NainDev", the site URL, a logo that exists in `public/`, and `sameAs`
  links to the company LinkedIn page, GitHub, GitLab and X profiles.
- SEO-015: When any page is rendered, the `Person` shall keep only personal
  profile links (GitHub, personal LinkedIn, GitLab, X) without the company
  LinkedIn page, and the `Organization` shall name the person as `founder`.
- SEO-016: When any page is rendered, the `WebSite` and every `BlogPosting`
  shall name the `Organization` as publisher.
- SEO-017: When an English page is built, the `Organization` identifier, URL and
  name shall stay identical to the Spanish ones, as for `Person` and `WebSite`.

## Edge cases

- The `Organization` carries no prose field, so the translation catalog does not
  change.
- The Google Business Profile link is not in `sameAs` yet: the listing is still
  in verification and not public (see `tasks.md`).
- The `naindev-contrast3d` GitHub organization stays on the person only; it is
  not asserted as a NainDev profile.
- SEO-003 and SEO-004 stay: titles remain unique and the home title keeps the
  brand and the author.

## Out of scope

- Postal address, telephone and contact points: the listing is a service-area
  business and the address is deliberately not published.
- A Wikidata item: it needs independent sources that do not exist yet.

## Session state

- Last updated: 2026-10-15
- Done: see `tasks.md`.
- Next: owner commit and deploy; then add the Google Business Profile link once
  the listing is public.
- Blocked: Google Business Profile verification (up to 5 days).
