import { createHash } from 'node:crypto';
import { parse, parseFragment, serialize, serializeOuter } from 'parse5';

export const origin = 'https://www.naindev.com';
export const normalize = value => value.replace(/\s+/gu, ' ').trim();
export const segmentId = source => createHash('sha256').update(normalize(source)).digest('hex');
export const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
export function setAttr(node, name, value) {
  const item = node.attrs?.find(item => item.name === name);
  if (item) item.value = value;
  else (node.attrs ??= []).push({ name, value });
}
export const descendants = node => [node, ...(node.childNodes ?? []).flatMap(descendants)];
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const ignored = new Set(['script', 'style', 'pre', 'code', 'svg', 'math']);
const inline = new Set(['a', 'span', 'strong', 'em', 'b', 'i', 'u', 's', 'small', 'code', 'br', 'wbr', 'img', 'svg', 'sup', 'sub', 'time', 'abbr', 'mark']);
const blocks = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'dt', 'dd', 'label', 'button', 'a', 'span', 'small', 'figcaption', 'blockquote', 'td', 'th', 'legend', 'summary', 'option', 'time', 'title', 'div']);
const attributes = new Set(['alt', 'title', 'aria-label', 'aria-description', 'placeholder', 'data-demo-message']);
const proseMeta = new Set(['description', 'keywords', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description', 'twitter:image:alt', 'article:tag']);
const schemaProse = new Set(['name', 'headline', 'description', 'jobTitle', 'serviceType', 'articleSection', 'keywords']);
const placeholder = /⟦\/?\d+\/?⟧/g;
const escapeText = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function englishPath(value) {
  if (!value || value.startsWith('#') || value.startsWith('//')) return value;
  const absolute = value.startsWith(`${origin}/`);
  if (!value.startsWith('/') && !absolute) return value;
  const url = new URL(value, origin);
  if (url.origin !== origin || /^\/(?:en|assets|_astro)(?:\/|$)/.test(url.pathname)
    || /\.(?:png|svg|ico|jpg|jpeg|webp|pdf|json|xml|txt|css|js)$/i.test(url.pathname)) return value;
  const hubs = { servicios: 'services', casos: 'case-studies', recursos: 'resources', tecnologia: 'technology', privacidad: 'privacy' };
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0]) parts[0] = hubs[parts[0]] ?? parts[0];
  url.pathname = `/en/${parts.join('/')}${parts.length && !/\.html$/i.test(url.pathname) ? '/' : ''}`;
  return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`;
}

function encodeBlock(node) {
  const tokens = new Map();
  let index = 0;
  function encode(child) {
    if (child.nodeName === '#text') return child.value;
    if (!child.tagName) return '';
    const id = index++;
    if (ignored.has(child.tagName) || attr(child, 'translate') === 'no' || !(child.childNodes?.length)) {
      const key = `⟦${id}/⟧`;
      tokens.set(key, serializeOuter(child));
      return key;
    }
    const empty = serializeOuter({ ...child, childNodes: [] });
    const end = empty.lastIndexOf('</');
    tokens.set(`⟦${id}⟧`, empty.slice(0, end));
    tokens.set(`⟦/${id}⟧`, empty.slice(end));
    return `⟦${id}⟧${child.childNodes.map(encode).join('')}⟦/${id}⟧`;
  }
  return { source: normalize(node.childNodes.map(encode).join('')), tokens };
}

export function validateTranslation(source, target) {
  if (typeof target !== 'string' || !target.trim()) throw new Error('Empty translation');
  if (JSON.stringify(source.match(placeholder) ?? []) !== JSON.stringify(target.match(placeholder) ?? [])) {
    throw new Error('Translation placeholder sequence changed');
  }
  if (target.replace(placeholder, '').includes('⟦') || target.replace(placeholder, '').includes('⟧')) throw new Error('Malformed placeholder');
  if (JSON.stringify(source.match(/\{\w+\}/g) ?? []) !== JSON.stringify(target.match(/\{\w+\}/g) ?? [])) throw new Error('Interface placeholder changed');
  const literals = value => (value.replace(placeholder, ' ').match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d+(?:[.,]\d+)*(?:%|M|K|GB|MB|ms)?|https?:\/\/[^\s]+|[€$£]|\b(?:NainDev|GitHub|FastAPI|SQL|Azure|Python|TypeScript)\b|\.NET|C#/g) ?? [])
    .map(value => /^\d{1,3}(?:[.,]\d{3})+$/.test(value) ? value.replaceAll('.', '').replaceAll(',', '') : value).sort();
  if (JSON.stringify(literals(source)) !== JSON.stringify(literals(target))) throw new Error('Protected literal changed');
}

const dataProse = new Set(['title', 'subtitle', 'status', 'summary', 'proof', 'label', 'name', 'description', 'problem', 'decisions', 'tradeoffs', 'tradeOffs', 'results', 'technologies']);
export function mapData(value, transform, key = '') {
  if (Array.isArray(value)) return value.map(item => mapData(item, transform, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapData(v, transform, k)]));
  if (typeof value === 'string' && dataProse.has(key)) return transform(value, key);
  return value;
}

export function extractSegments(document) {
  const segments = [];
  function add(source, apply, context) {
    source = normalize(source);
    if (!/\p{L}/u.test(source.replace(placeholder, ''))) return;
    segments.push({ id: segmentId(source), source, context, apply });
  }
  function schemaValues(value, key, apply) {
    if (typeof value === 'string' && schemaProse.has(key)) add(value, apply, `schema:${key}`);
    else if (Array.isArray(value)) value.forEach((item, index) => schemaValues(item, key, replacement => { value[index] = replacement; }));
    else if (value && typeof value === 'object') for (const [childKey, item] of Object.entries(value)) {
      if (['Person', 'WebSite'].includes(value['@type']) && childKey === 'name') continue;
      schemaValues(item, childKey, replacement => { value[childKey] = replacement; });
    }
  }
  function visit(node, covered = false) {
    if (attr(node, 'translate') === 'no' || (attr(node, 'class') ?? '').split(/\s+/).includes('mermaid')) return;
    if (node.tagName === 'script' && attr(node, 'type') === 'application/ld+json') {
      const schema = JSON.parse(text(node));
      schemaValues(schema, '', () => {});
      node.localizedSchema = schema;
      return;
    }
    if (ignored.has(node.tagName)) return;
    for (const item of node.attrs ?? []) {
      if (attributes.has(item.name) || (node.tagName === 'meta' && item.name === 'content' && proseMeta.has(attr(node, 'name') ?? attr(node, 'property')))) {
        add(item.value, value => { item.value = value; }, `${node.tagName}:${item.name}`);
      }
    }
    const children = node.childNodes ?? [];
    if (!covered && blocks.has(node.tagName) && children.every(child => !child.tagName || inline.has(child.tagName)) && text(node).trim()) {
      const { source } = encodeBlock(node);
      add(source, value => {
        const { tokens } = encodeBlock(node);
        let html = '';
        let offset = 0;
        for (const match of value.matchAll(placeholder)) {
          html += escapeText(value.slice(offset, match.index)) + tokens.get(match[0]);
          offset = match.index + match[0].length;
        }
        html += escapeText(value.slice(offset));
        node.childNodes = parseFragment(html).childNodes;
        node.childNodes.forEach(child => { child.parentNode = node; });
      }, node.tagName);
      // Attribute translations must run before the containing block is serialized.
      children.forEach(child => visit(child, true));
      return;
    }
    if (!covered && node.nodeName === '#text' && node.value.trim()) {
      const leading = node.value.match(/^\s*/)[0];
      const trailing = node.value.match(/\s*$/)[0];
      add(node.value, value => { node.value = leading + value + trailing; }, 'text');
    }
    children.forEach(child => visit(child, covered));
  }
  visit(document);
  return segments;
}

export function makeCatalog(segments, targets) {
  return Object.fromEntries(segments.map((segment, index) => [segment.id, { source: segment.source, target: targets[index], status: 'reviewed' }]));
}

export function translated(source, catalog) {
  const normalized = normalize(source);
  if (!/\p{L}/u.test(normalized.replace(placeholder, ''))) return source;
  const entry = catalog[segmentId(normalized)];
  if (!entry || entry.source !== normalized) throw new Error(`Missing translation: ${normalized.slice(0, 100)}`);
  if (entry.status !== 'reviewed') throw new Error(`Translation requires review: ${normalized.slice(0, 100)}`);
  validateTranslation(normalized, entry.target);
  return entry.target;
}

export function localizeDocument(source, catalog) {
  const doc = parse(source, { scriptingEnabled: false });
  const segments = extractSegments(doc);
  // Resolve every value before mutation so missing entries cannot yield partial pages.
  const replacements = segments.map(segment => translated(segment.source, catalog));
  for (let index = segments.length - 1; index >= 0; index--) segments[index].apply(replacements[index]);
  for (const node of descendants(doc)) {
    if (node.tagName === 'html') setAttr(node, 'lang', 'en-US');
    for (const item of node.attrs ?? []) {
      if (item.name === 'href' && !(node.tagName === 'link' && attr(node, 'rel') === 'alternate')) item.value = englishPath(item.value);
      if (item.name === 'content' && attr(node, 'property') === 'og:url') item.value = englishPath(item.value);
      if (item.name === 'content' && attr(node, 'property') === 'og:locale') item.value = 'en_US';
    }
    if (node.localizedSchema) {
      function localize(value, key, type) {
        if (Array.isArray(value)) return value.map(item => localize(item, key, type));
        if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, k, value['@type'])]));
        if (key === 'inLanguage') return type === 'WebSite' ? ['es-ES', 'en-US'] : 'en-US';
        if (typeof value === 'string' && ['url', '@id', 'item'].includes(key)) {
          if ([`${origin}/#person`, `${origin}/#website`].includes(value) || (key === 'url' && ['Person', 'WebSite'].includes(type))) return value;
          return englishPath(value);
        }
        return value;
      }
      const schema = localize(node.localizedSchema, '');
      node.childNodes = [{ nodeName: '#text', value: JSON.stringify(schema).replaceAll('<', '\\u003c'), parentNode: node }];
    }
  }
  return serialize(doc);
}
