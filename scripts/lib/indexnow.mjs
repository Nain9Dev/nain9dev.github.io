// IndexNow payload for the main site (specs/next-seo-indexnow, DISC-012 and DISC-013).
// The key is public by design: the protocol proves ownership by fetching it from the site root.
export const INDEXNOW_HOST = 'www.naindev.com';
export const INDEXNOW_KEY = 'e89a898d38f718d7143f23387529064a';
const LIMIT = 10_000;

export function sitemapUrls(xml) {
  return [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]))];
}

export function buildIndexNowPayload(urlList) {
  if (urlList.length === 0) throw new Error('No URLs to submit');
  if (urlList.length > LIMIT) throw new Error(`IndexNow accepts at most ${LIMIT} URLs per request (got ${urlList.length}); the limit is 10000`);
  for (const url of urlList) {
    if (new URL(url).host !== INDEXNOW_HOST) throw new Error(`URL of another host: ${url}`);
  }
  return { host: INDEXNOW_HOST, key: INDEXNOW_KEY, keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`, urlList };
}
