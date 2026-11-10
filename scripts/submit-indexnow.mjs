// Tells IndexNow engines (Bing, Yandex, Seznam, Naver and others) which URLs of the main site exist.
// Run it by hand after a deploy: `node scripts/submit-indexnow.mjs`. It reads the live sitemap, so the
// published pages are the ones submitted. Add `--dry-run` to print the payload without sending it.
import { buildIndexNowPayload, INDEXNOW_HOST, sitemapUrls } from './lib/indexnow.mjs';

const dryRun = process.argv.includes('--dry-run');
const response = await fetch(`https://${INDEXNOW_HOST}/sitemap-0.xml`, { signal: AbortSignal.timeout(30_000) });
if (!response.ok) throw new Error(`Sitemap answered HTTP ${response.status}`);
const payload = buildIndexNowPayload(sitemapUrls(await response.text()));

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  const result = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  });
  // 200 and 202 mean accepted; 202 means the key file is still being validated.
  console.log(`IndexNow answered HTTP ${result.status} for ${payload.urlList.length} URLs`);
  if (![200, 202].includes(result.status)) process.exit(1);
}
