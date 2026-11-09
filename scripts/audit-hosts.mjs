// Weekly audit of every public host (specs/next-seo-host-audit, DISC-008, DISC-010):
// fetches the page, robots.txt, sitemap.xml and llms.txt and fails if the baseline regressed.
import { readFile } from 'node:fs/promises';
import { auditHost, hostsFromCatalog } from './lib/host-audit.mjs';

const catalog = JSON.parse(await readFile('public/assets/data/projects.json', 'utf8'));
const hosts = hostsFromCatalog(catalog);

async function fetchText(url) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000), headers: { 'User-Agent': 'naindev-seo-audit/1.0' } });
    return { status: response.status, body: await response.text() };
  } catch (error) {
    return { status: 0, body: String(error) };
  }
}

const findings = [];
for (const host of hosts) {
  const base = `https://${host}`;
  const [page, robots, llms] = await Promise.all(['/', '/robots.txt', '/llms.txt'].map(path => fetchText(base + path)));
  // Audit the sitemap that robots.txt advertises on this host, falling back to /sitemap.xml.
  const advertised = new RegExp(`^\\s*Sitemap:\\s*(https://${host.replaceAll('.', '\\.')}/\\S*)`, 'im').exec(robots.body)?.[1];
  const sitemap = await fetchText(advertised ?? `${base}/sitemap.xml`);
  const result = auditHost({ host, page, robots, sitemap, llms });
  console.log(`${result.length === 0 ? 'ok  ' : 'FAIL'} ${host}`);
  findings.push(...result);
}

if (findings.length > 0) {
  console.error(`\n${findings.length} finding(s):\n${findings.map(finding => `- ${finding}`).join('\n')}`);
  process.exit(1);
}
console.log(`\nDiscoverability baseline met on ${hosts.length} hosts.`);
