import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Claims the owner marked as unverified.
// See specs/005-remove-unverified-claims, specs/006-remove-unverified-metrics
// and specs/009-honest-offer-copy.
export const BLOCKED_CLAIMS = [
  /\+\s*50\s*M(?![B])/i,
  /\b50\s*M\s+(modelos|models)\b/i,
  /\b40\s*(→|->)\s*6\s*min/i,
  /uptime (en|in|on) (sistemas cr[ií]ticos|critical systems)/i,
  /desarrolladores mentorizados|developers mentored|mentored developers/i,
  /arquitecturas migradas|architectures migrated|migrated architectures/i,
  /colaborador oss|oss contributor/i,
  /\b99[.,]9\d\s*%/,
  /latencia p95|p95 latency/i,
  /\buptime:\s*\d/i,
  /\[REDACTED\]/,
];

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE_DIRS = ['src/components', 'src/pages', 'src/content', 'public/assets/data'];
const IGNORED_DIRS = new Set(['src/content/marketing']);
const EXTENSIONS = /\.(astro|mdx?|html|json)$/;

export function findBlockedClaims(text) {
  return BLOCKED_CLAIMS.filter((pattern) => pattern.test(text)).map(String);
}

async function listFiles(dir, extensions) {
  const absolute = join(ROOT, dir);
  let entries;
  try {
    entries = await readdir(absolute, { withFileTypes: true, recursive: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isFile() && extensions.test(entry.name))
    .map((entry) => relative(ROOT, join(entry.parentPath, entry.name)).replaceAll('\\', '/'))
    .filter((file) => ![...IGNORED_DIRS].some((ignored) => file.startsWith(`${ignored}/`)));
}

export async function scan(dirs, extensions = EXTENSIONS) {
  const findings = [];
  for (const dir of dirs) {
    for (const file of await listFiles(dir, extensions)) {
      const matches = findBlockedClaims(await readFile(join(ROOT, file), 'utf8'));
      if (matches.length) findings.push({ file, matches });
    }
  }
  return findings;
}

export const scanSources = () => scan(SOURCE_DIRS);
export const scanBuild = () => scan(['dist'], /\.html$/);

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const findings = [...(await scanSources()), ...(await scanBuild())];
  if (findings.length) {
    for (const { file, matches } of findings) console.error(`Blocked claim in ${file}: ${matches.join(', ')}`);
    process.exit(1);
  }
  console.log('Claim check passed: no blocked claims in sources or build output.');
}
