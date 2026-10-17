# Organization Brand Profiles

Status: In progress (not committed or deployed; awaits owner approval)

## Objective

Spec 036 gave NainDev an `Organization` node whose `sameAs` lists LinkedIn,
GitHub, GitLab and X. On 2026-10-17 the owner created the brand channels on
YouTube, Instagram and TikTok. Listing them in `sameAs` lets search engines
merge every brand profile into one entity.

## Requirements

- SEO-018: When any page is rendered, the `Organization` `sameAs` shall also
  list the brand YouTube channel, Instagram and TikTok profiles, in addition
  to the links required by SEO-014.
- SEO-019: When any page is rendered, the `Person` `sameAs` shall not list the
  brand-only channels (YouTube, Instagram, TikTok); they describe the
  organization, not the person.

## Profile URLs (owner-confirmed 2026-10-17)

- YouTube: `https://www.youtube.com/@Nain9Dev` (brand channel only; the
  owner's Spanish channel "Hábitos de un Dev" is not NainDev and stays out).
- Instagram: `https://www.instagram.com/nainndev/` (double "n", as in the live
  profile URL).
- TikTok: `https://www.tiktok.com/@nain9dev`.
- GitHub (`https://github.com/Nain9Dev`) and X (`https://x.com/Nain9Dev`) are
  already in `sameAs` (SEO-014); they are not duplicated.

## Edge cases

- Google Business Profile: the link supplied by the owner is a
  `g.page/r/.../review` link, which opens the "write a review" dialog and does
  not identify the listing. It is not added; the real profile or Maps URL is
  pending (see `tasks.md`).
- The `naindev-contrast3d` GitHub organization stays out, as decided in
  spec 036.
- No prose changes, so the translation catalog does not change and SEO-017
  keeps holding for English pages.

## Out of scope

- Wikidata, postal address, telephone (see spec 036).

## Session state

- Last updated: 2026-10-17
- Done: spec, failing test.
- Next: implementation, local checks, owner approval, deploy.
- Blocked: Google Business Profile URL (owner).
