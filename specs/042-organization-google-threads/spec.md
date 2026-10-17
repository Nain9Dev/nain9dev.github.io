# Organization Google Business Profile and Threads

Status: In progress (local; not pushed)

## Objective

Spec 040 left two brand profiles out of the `Organization` `sameAs`: the Google Business Profile (the first link supplied was a review link) and Threads. On 2026-10-17 the owner supplied the profile "Share" link and confirmed Threads.

## Requirements

- SEO-020: When any page is rendered, the `Organization` `sameAs` shall also list the Google Business Profile share link `https://share.google/1tIQO3tlW8K8qVZ9R` and the Threads profile `https://www.threads.com/@nainndev`.
- SEO-021: When any page is rendered, the `Person` `sameAs` shall not list the Google Business Profile or Threads (brand channels, as in SEO-019).

## Edge cases

- The Google link is a `share.google` short link supplied by the owner as the listing's share link; it redirects to a Google share endpoint (HTTP 200 on 2026-10-17). It could not be resolved to the listing without Google's scripts, so the owner's word is the evidence. The earlier `g.page/r/.../review` link stays out.
- Threads is the brand account `@nainndev` created on 2026-10-17; its host is `threads.com`.

## Out of scope

- Wikidata, address, telephone (specs 036 and 040).

## Session state

- Last updated: 2026-10-17
- Done: spec, tests, implementation.
- Next: owner push and deploy; production check.
- Blocked: —
