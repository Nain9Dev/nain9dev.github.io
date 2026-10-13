# ADR-0004: Field Web Vitals reported to Plausible

Status: Proposed
Date: 2026-10-13

## Context

Specs 020 to 031 were measured only in the lab (Lighthouse). Production traces showed delays that only real browsers can confirm or rule out, and the site has too little traffic for the Chrome UX Report. Plausible is already loaded on every page, cookieless, and accepts custom events with properties. Each event counts towards the Plausible monthly quota.

## Decision

- Add the `web-vitals` library (Google Chrome team, MIT, pinned exactly to 6.2.2, the newest release older than two weeks on 2026-10-13).
- On 25 % of page views, chosen at random, load a small reporting module when the browser is idle, observe LCP, INP and CLS, and send one Plausible custom event `Web Vitals` per page when the page is first hidden. Properties are the three ratings, bucketed values and a device class; no identifiers.
- Send the event with `interactive: false`, so it does not change bounce rate or visit duration.

## Consequences

- About 25 % more Plausible events per month than page views alone.
- Unsampled page views download nothing extra; sampled ones load about 3 KiB.
- The owner registers the custom properties in Plausible (Site Settings → Custom Properties) to see them broken down (B-017).

## Alternatives considered

- **One event per metric**: three times the quota for the same information.
- **Every page view**: faster data, doubles the quota.
- **A separate RUM service**: another third party, account and privacy review.
