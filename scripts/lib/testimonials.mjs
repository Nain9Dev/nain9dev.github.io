// Validation and edits for src/data/testimonials.json. Mirrors the schema in src/content.config.ts
// (checked by scripts/testimonials.test.mjs); the build stays the final authority.

const RELATIONSHIPS = ['client', 'partner'];
const STATUSES = ['pending', 'approved'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isText = (value, min = 1) => typeof value === 'string' && value.trim().length >= min;
const isDate = (value) => typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(Date.parse(value));
const isHttps = (value) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

export function validateEntry(entry) {
  const errors = [];
  if (!entry || typeof entry !== 'object') return ['entry must be an object'];
  if (!isText(entry.id) || !SLUG.test(entry.id)) errors.push('id must be a lowercase slug such as "acme-client-2026"');
  for (const field of ['name', 'role', 'company']) {
    if (!isText(entry[field])) errors.push(`${field} is required`);
  }
  for (const field of ['companyUrl', 'sourceUrl']) {
    if (entry[field] !== undefined && !isHttps(entry[field])) errors.push(`${field} must be an https URL`);
  }
  if (!RELATIONSHIPS.includes(entry.relationship)) errors.push(`relationship must be one of: ${RELATIONSHIPS.join(', ')}`);
  if (!isDate(entry.date)) errors.push('date must be YYYY-MM-DD');
  if (!isText(entry.quote, 20)) errors.push('quote must be the author\'s own words (at least 20 characters)');
  if (entry.status !== undefined && !STATUSES.includes(entry.status)) errors.push(`status must be one of: ${STATUSES.join(', ')}`);
  const consent = entry.consent;
  if (!consent || typeof consent !== 'object') {
    errors.push('consent is required: { granted: true, date, evidence }');
  } else {
    if (consent.granted !== true) errors.push('consent.granted must be true');
    if (!isDate(consent.date)) errors.push('consent.date must be YYYY-MM-DD');
    if (!isText(consent.evidence, 10)) errors.push('consent.evidence must say where the written confirmation is (at least 10 characters)');
  }
  return errors;
}

// New entries always start as pending: approval is a separate, explicit step.
export function addEntry(list, entry) {
  const errors = validateEntry(entry);
  if (errors.length > 0) throw new Error(`Invalid entry:\n- ${errors.join('\n- ')}`);
  if (list.some((existing) => existing.id === entry.id)) throw new Error(`Entry "${entry.id}" already exists`);
  return [...list, { ...entry, status: 'pending' }];
}

export function approveEntry(list, id) {
  if (!list.some((entry) => entry.id === id)) throw new Error(`Entry "${id}" not found`);
  return list.map((entry) => (entry.id === id ? { ...entry, status: 'approved' } : entry));
}

export function removeEntry(list, id) {
  if (!list.some((entry) => entry.id === id)) throw new Error(`Entry "${id}" not found`);
  return list.filter((entry) => entry.id !== id);
}

export const serialize = (list) => `${JSON.stringify(list, null, 2)}\n`;
