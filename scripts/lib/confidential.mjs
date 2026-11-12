import { createHash } from 'node:crypto';

// Guard against confidential names in public copy without publishing the list of those names.
//
// scripts/confidential-hashes.json holds SHA-256 hashes of normalized terms, never the terms. A text is
// checked by hashing every window of up to four consecutive words. Add a term with
// `node scripts/confidential-hash.mjs "<term>"` and paste the printed hash into the list.
//
// Limit, stated: this is obscurity, not secrecy. Nobody can read the list, but anyone who already
// knows a term can confirm it is there. A `#` in a term stands for any number, so `ab-#` covers
// `AB-7` and `ab-123`.

const MAX_WORDS = 4;

const fold = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Lower case, no accents, every run of other characters becomes one space. */
export function normalize(text) {
  return fold(text)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

/** The hash to store for a confidential term (a `#` stands for any number). */
export function hashTerm(term) {
  const normalized = fold(term)
    .replace(/[^a-z0-9#]+/g, ' ')
    .trim();
  if (normalized === '') throw new Error('a term cannot be empty');
  if (normalized.split(' ').length > MAX_WORDS) throw new Error('a term has at most four words');
  return sha256(normalized);
}

/** The windows of `text` (normalized) whose hash is in `hashes`, in order of appearance. */
export function findConfidential(text, hashes) {
  const known = new Set(hashes);
  if (known.size === 0) return [];
  const words = normalize(text).split(' ').filter(Boolean);
  const found = [];
  for (let start = 0; start < words.length; start += 1) {
    for (let length = 1; length <= MAX_WORDS && start + length <= words.length; length += 1) {
      const window = words.slice(start, start + length).join(' ');
      const masked = window.replace(/\d+/g, '#');
      if (known.has(sha256(window)) || (masked !== window && known.has(sha256(masked)))) found.push(window);
    }
  }
  return found;
}
