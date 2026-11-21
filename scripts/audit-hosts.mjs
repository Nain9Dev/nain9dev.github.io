// Weekly audit of every public host (specs/next-seo-host-audit, DISC-008, DISC-010, DISC-014 to DISC-016):
// fetches the page, robots.txt, sitemap.xml and llms.txt, checks that every sitemap URL answers 200 and that
// plain http hands over to https, and fails if the baseline regressed.
import { readFile } from 'node:fs/promises';
import { auditHost, auditedHosts } from './lib/host-audit.mjs';

const catalog = JSON.parse(await readFile('public/assets/data/projects.json', 'utf8'));
const hosts = auditedHosts(catalog);
const HEADERS = { 'User-Agent': 'naindev-seo-audit/1.0' };

async function fetchText(url) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000), headers: HEADERS });
    return { status: response.status, body: await response.text() };
  } catch (error) {
    return { status: 0, body: String(error) };
  }
}

async function fetchStatus(url) {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000), headers: HEADERS });
    await response.body?.cancel();
    return response.status;
  } catch {
    return 0;
  }
}

async function httpRedirectOf(host) {
  try {
    const response = await fetch(`http://${host}/`, { redirect: 'manual', signal: AbortSignal.timeout(30_000), headers: HEADERS });
    await response.body?.cancel();
    return { status: response.status, location: response.headers.get('location') ?? '' };
  } catch {
    return { status: 0, location: '' };
  }
}

const locs = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());

/** Pages listed by a urlset, or by the child sitemaps of an index, with the status each one answers. */
async function listedPages(sitemap) {
  let urls = locs(sitemap.body);
  if (sitemap.body.includes('<sitemapindex')) {
    const children = await Promise.all(urls.map(fetchText));
    urls = children.flatMap(child => locs(child.body));
  }
  const listed = [];
  for (let index = 0; index < urls.length; index += 8) {
    const chunk = urls.slice(index, index + 8);
    const statuses = await Promise.all(chunk.map(fetchStatus));
    chunk.forEach((url, offset) => listed.push({ url, status: statuses[offset] }));
  }
  return listed;
}

const findings = [];
for (const host of hosts) {
  const base = `https://${host}`;
  const [page, robots, llms] = await Promise.all(['/', '/robots.txt', '/llms.txt'].map(path => fetchText(base + path)));
  // Audit the sitemap that robots.txt advertises on this host, falling back to /sitemap.xml.
  const advertised = new RegExp(`^\\s*Sitemap:\\s*(https://${host.replaceAll('.', '\\.')}/\\S*)`, 'im').exec(robots.body)?.[1];
  const sitemap = await fetchText(advertised ?? `${base}/sitemap.xml`);
  const listed = sitemap.status === 200 ? await listedPages(sitemap) : [];
  const httpRedirect = await httpRedirectOf(host);
  const result = auditHost({ host, page, robots, sitemap, llms, listed, httpRedirect });
  console.log(`${result.length === 0 ? 'ok  ' : 'FAIL'} ${host} (${listed.length} sitemap URLs)`);
  findings.push(...result);
}

if (findings.length > 0) {
  console.error(`\n${findings.length} finding(s):\n${findings.map(finding => `- ${finding}`).join('\n')}`);
  process.exit(1);
}
console.log(`\nDiscoverability baseline met on ${hosts.length} hosts.`);
