// Motion rules of brandbook v2.0 (ADR-0012, decision 4), shared by the static and the runtime checks
// in tools/check.mjs. Only transform, opacity, clip-path and mask animate; every movement lasts
// 120–520 ms; two easings (--ease-out, --ease-std); the agenda loop (.agd) is the one living surface
// in CSS and may run an 8 s cycle made of 120–520 ms movements.
// No dependencies: a small CSS reader that is enough for the prototype's hand-written stylesheet.

export const MIN_MS = 120;
export const MAX_MS = 520;
export const CYCLE_MS = 8000;
export const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';
export const EASE_STD = 'cubic-bezier(.2,0,0,1)';
export const EASING_TOKENS = { '--ease-out': EASE_OUT, '--ease-std': EASE_STD };

// transform, opacity, clip-path, mask (and its longhands, with or without the -webkit- prefix)
export function allowedProperty(p) {
  p = String(p).trim().toLowerCase();
  return p === 'transform' || p === 'opacity' || p === 'clip-path' || p === '-webkit-clip-path' || /^(-webkit-)?mask(-[a-z-]+)?$/.test(p);
}

// "cubic-bezier(0.22, 1, 0.36, 1)" and "cubic-bezier(.22,1,.36,1)" compare equal.
export function normEasing(s) {
  s = String(s).trim().toLowerCase().replace(/\s+/g, '');
  const m = s.match(/^cubic-bezier\(([^)]*)\)$/);
  if (!m) return s;
  return 'cubic-bezier(' + m[1].split(',').map((n) => String(+n).replace(/^0\./, '.').replace(/^-0\./, '-.')).join(',') + ')';
}
export const ALLOWED_EASINGS = new Set([normEasing(EASE_OUT), normEasing(EASE_STD)]);
export const allowedEasing = (s) => ALLOWED_EASINGS.has(normEasing(s));

// ------------------------------------------------------------------ CSS reader
export function stripComments(css) {
  let out = '', i = 0, q = null;
  while (i < css.length) {
    const c = css[i];
    if (q) { out += c; if (c === '\\') { out += css[i + 1] || ''; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; out += c; i++; continue; }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); const chunk = css.slice(i, e < 0 ? css.length : e + 2); out += chunk.replace(/[^\n]/g, ' '); i = e < 0 ? css.length : e + 2; continue; }
    out += c; i++;
  }
  return out;
}

// Reads until one of the stop characters at depth 0, outside strings. Returns [text, index of stop].
function readUntil(s, i, stops) {
  let depth = 0, q = null;
  const start = i;
  for (; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (depth === 0 && stops.includes(c)) return [s.slice(start, i), i];
  }
  return [s.slice(start), s.length];
}
const lineAt = (s, i) => s.slice(0, i).split('\n').length;

// Parses a block body (between braces, or the whole sheet) into rules.
// Rules: { kind: 'style'|'keyframes'|'at', selector, decls: [{prop, value, important, line}], ctx: [...], frames?, line }
export function parseCss(src, file = 'css') {
  const s = stripComments(src);
  const rules = [];
  function block(i, ctx, endChar) {
    while (i < s.length) {
      while (i < s.length && /\s|;/.test(s[i])) i++;
      if (i >= s.length) return i;
      if (s[i] === endChar) return i + 1;
      const [prelude, j] = readUntil(s, i, '{;}');
      if (j >= s.length) return j;
      if (s[j] === ';') { i = j + 1; continue; }              // @import, @charset
      if (s[j] === '}') { i = j; continue; }
      const p = prelude.trim();
      const line = lineAt(s, i);
      if (/^@(-webkit-)?keyframes\b/i.test(p)) {
        const name = p.replace(/^@(-webkit-)?keyframes\s+/i, '').trim().replace(/^["']|["']$/g, '');
        const frames = [];
        let k = j + 1;
        while (k < s.length) {
          while (k < s.length && /\s/.test(s[k])) k++;
          if (s[k] === '}') { k++; break; }
          const [fsel, fj] = readUntil(s, k, '{}');
          if (s[fj] !== '{') { k = fj + 1; break; }
          const [body, bj] = readUntil(s, fj + 1, '}');
          frames.push({ selector: fsel.trim(), decls: decls(body, lineAt(s, fj)), line: lineAt(s, k) });
          k = bj + 1;
        }
        rules.push({ kind: 'keyframes', name, frames, ctx, file, line });
        i = k;
      } else if (/^@(media|supports|container|layer|document)\b/i.test(p)) {
        i = block(j + 1, ctx.concat(p), '}');
      } else if (p.startsWith('@')) {
        const [body, bj] = readUntil(s, j + 1, '}');
        rules.push({ kind: 'at', selector: p, decls: decls(body, line), ctx, file, line });
        i = bj + 1;
      } else {
        // a style rule; nested rules inside (CSS nesting) are read as their own rules
        let k = j + 1, body = '';
        for (;;) {
          const [chunk, cj] = readUntil(s, k, '{}');
          if (s[cj] === '{') {
            const lastSemi = Math.max(chunk.lastIndexOf(';'), -1);
            body += chunk.slice(0, lastSemi + 1);
            const nestedSel = chunk.slice(lastSemi + 1).trim().replace(/&/g, p);
            const [nb, nj] = readUntil(s, cj + 1, '}');
            rules.push({ kind: 'style', selector: nestedSel, decls: decls(nb, lineAt(s, cj)), ctx, file, line: lineAt(s, cj) });
            k = nj + 1;
            continue;
          }
          body += chunk; k = cj + 1; break;
        }
        rules.push({ kind: 'style', selector: p, decls: decls(body, line), ctx, file, line });
        i = k;
      }
    }
    return i;
  }
  function decls(body, line0) {
    const out = [];
    let i = 0;
    while (i < body.length) {
      const [d, j] = readUntil(body, i, ';');
      const c = d.indexOf(':');
      if (c > 0) {
        const prop = d.slice(0, c).trim().toLowerCase();
        let value = d.slice(c + 1).trim();
        const important = /!\s*important\s*$/i.test(value);
        value = value.replace(/!\s*important\s*$/i, '').trim();
        if (prop) out.push({ prop, value, important, line: line0 + (body.slice(0, i).match(/\n/g) || []).length });
      }
      i = j + 1;
    }
    return out;
  }
  block(0, [], null);
  return rules;
}

// Splits at top-level commas / whitespace (parentheses and strings kept whole).
export function splitTop(v, sep) {
  const out = [];
  let depth = 0, q = null, cur = '';
  for (let i = 0; i < v.length; i++) {
    const c = v[i];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === '(') depth++;
    if (c === ')') depth--;
    const isSep = sep === ',' ? c === ',' : /\s/.test(c);
    if (depth === 0 && isSep) { if (cur.trim() || sep === ',') out.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() || (sep === ',' && out.length)) out.push(cur.trim());
  return out.filter((x) => x !== '' || sep === ',');
}

// ------------------------------------------------------------------ custom properties and times
export function customProps(rules) {
  const map = new Map();          // name -> [{value, selector}]
  for (const r of rules) {
    if (r.kind !== 'style') continue;
    for (const d of r.decls) if (d.prop.startsWith('--')) {
      if (!map.has(d.prop)) map.set(d.prop, []);
      map.get(d.prop).push({ value: d.value, selector: r.selector, ctx: r.ctx });
    }
  }
  return map;
}
// The value a var() takes: the :root definition outside media queries if any, else the only one, else the fallback.
function lookup(vars, name) {
  const defs = vars.get(name) || [];
  const root = defs.filter((d) => /(^|,)\s*:root\s*(,|$)/.test(d.selector) && !d.ctx.length);
  if (root.length) return root[root.length - 1].value;
  const uniq = [...new Set(defs.map((d) => d.value))];
  if (uniq.length === 1) return uniq[0];
  return null;
}
export function resolveVars(v, vars, depth = 0) {
  if (depth > 8) return null;
  let unresolved = false;
  const out = v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*((?:[^()]|\([^()]*\))*))?\)/g, (_, name, fb) => {
    const val = lookup(vars, name);
    if (val != null) { const r = resolveVars(val, vars, depth + 1); if (r == null) { unresolved = true; return ''; } return r; }
    if (fb != null) return fb.trim();
    unresolved = true; return '';
  });
  return unresolved ? null : out;
}

// Evaluates a time: "600ms", ".2s", "calc(…)", "min(…)", "max(…)", with numbers. Returns ms or null.
export function evalTime(expr) {
  const src = String(expr).trim();
  let i = 0;
  const peek = () => { while (/\s/.test(src[i] || '')) i++; return src[i]; };
  function num() {
    peek();
    const m = src.slice(i).match(/^[+-]?(\d+\.?\d*|\.\d+)(ms|s)?/i);
    if (!m) return null;
    i += m[0].length;
    const n = parseFloat(m[0]);
    if (!m[2]) return { v: n, t: false };
    return { v: m[2].toLowerCase() === 's' ? n * 1000 : n, t: true };
  }
  function atom() {
    const c = peek();
    if (c === '(') { i++; const v = sum(); if (peek() === ')') i++; return v; }
    const f = src.slice(i).match(/^(calc|min|max|clamp)\(/i);
    if (f) {
      i += f[0].length;
      const args = [];
      for (;;) { args.push(sum()); if (peek() === ',') { i++; continue; } if (peek() === ')') { i++; break; } return null; }
      if (args.some((a) => !a)) return null;
      const name = f[1].toLowerCase();
      if (name === 'calc') return args[0];
      if (name === 'clamp') return { v: Math.max(args[0].v, Math.min(args[1].v, args[2].v)), t: true };
      const vs = args.map((a) => a.v);
      return { v: name === 'min' ? Math.min(...vs) : Math.max(...vs), t: args.some((a) => a.t) };
    }
    return num();
  }
  function prod() {
    let a = atom();
    for (;;) {
      const c = peek();
      if (!a || (c !== '*' && c !== '/')) return a;
      i++;
      const b = atom();
      if (!b) return null;
      a = c === '*' ? { v: a.v * b.v, t: a.t || b.t } : { v: a.v / b.v, t: a.t };
    }
  }
  function sum() {
    let a = prod();
    for (;;) {
      const c = peek();
      if (!a || (c !== '+' && c !== '-')) return a;
      i++;
      const b = prod();
      if (!b) return null;
      a = { v: c === '+' ? a.v + b.v : a.v - b.v, t: a.t || b.t };
    }
  }
  const r = sum();
  if (!r || peek() !== undefined || !r.t) return null;
  return Math.round(r.v * 1000) / 1000;
}

const TIMING_RE = /^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)$|^(cubic-bezier|steps|linear)\(/i;
const TIME_RE = /^[+-]?(\d+\.?\d*|\.\d+)m?s$/i;

// Classifies a raw token of a transition/animation shorthand. A var() is resolved to find out what it is.
function classify(raw, vars) {
  const tok = raw.match(/^var\(\s*(--ease-(?:out|std))\s*\)$/i);
  if (tok) return { kind: 'timing', raw, value: EASING_TOKENS[tok[1].toLowerCase()] };
  const r = /^var\(/i.test(raw) || /^(calc|min|max|clamp)\(/i.test(raw) ? resolveVars(raw, vars) : raw;
  if (r == null) return { kind: 'unknown', raw };
  const t = r.trim();
  if (TIMING_RE.test(t)) return { kind: 'timing', raw, value: t };
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return { kind: 'number', raw, value: +t };
  if (TIME_RE.test(t) || /^(calc|min|max|clamp)\(/i.test(t)) { const ms = evalTime(t); return ms == null ? { kind: 'unknown', raw } : { kind: 'time', raw, ms }; }
  return { kind: 'ident', raw, value: t };
}

// ------------------------------------------------------------------ the rules
const ANIM_KEYWORDS = new Set(['none', 'infinite', 'normal', 'reverse', 'alternate', 'alternate-reverse', 'forwards', 'backwards', 'both', 'running', 'paused']);

function timingProblem(raw, resolved) {
  const r = String(raw).trim();
  if (/^var\(\s*--ease-(out|std)\s*\)$/i.test(r)) return null;
  if (allowedEasing(r)) return null;
  return `timing function ${r}${resolved && resolved !== r ? ` (= ${resolved})` : ''} is not var(--ease-out), var(--ease-std) or their literal values`;
}

// Returns { problems: [{where, msg}], facts: {...} } for a set of parsed sheets.
// sheets: [{ file, rules }]
export function checkMotionCss(sheets) {
  const problems = [];
  const all = sheets.flatMap((s) => s.rules);
  const vars = customProps(all);
  const where = (r, d) => `${r.file}:${d ? d.line : r.line} ${r.selector || '@keyframes ' + r.name}`.slice(0, 160);
  const facts = { transitions: 0, animations: 0, keyframes: 0, agdNames: new Set(), agdCycle: null };

  // the two tokens
  for (const [name, val] of Object.entries(EASING_TOKENS)) {
    const v = lookup(vars, name);
    if (v == null) problems.push({ where: 'nain.css :root', msg: `token ${name} is not defined (expected ${val})` });
    else if (normEasing(v) !== normEasing(val)) problems.push({ where: 'nain.css :root', msg: `token ${name} is ${v}, expected ${val}` });
  }

  for (const r of all) {
    if (r.kind !== 'style') continue;
    const isAgd = /\.agd\b/.test(r.selector);
    const get = (p) => r.decls.filter((d) => d.prop === p);
    // --- transitions
    for (const d of r.decls) {
      if (d.prop === 'transition') {
        if (/^none$/i.test(d.value.trim())) continue;
        facts.transitions++;
        for (const item of splitTop(d.value, ',')) {
          const toks = splitTop(item, ' ').map((t) => classify(t, vars));
          const props = toks.filter((t) => t.kind === 'ident' && !/^(allow-discrete|normal)$/i.test(t.value));
          const times = toks.filter((t) => t.kind === 'time');
          const timing = toks.filter((t) => t.kind === 'timing');
          const unknown = toks.filter((t) => t.kind === 'unknown');
          const prop = props.length ? props[0].value : (unknown.length ? null : 'all');
          if (prop && !allowedProperty(prop)) problems.push({ where: where(r, d), msg: `transition of ${prop}${prop === 'all' ? ' (implicit or explicit "all")' : ''}` });
          if (times.length) {
            const ms = times[0].ms;
            if (ms >= 1 && (ms < MIN_MS || ms > MAX_MS)) problems.push({ where: where(r, d), msg: `transition duration ${times[0].raw} = ${ms} ms outside ${MIN_MS}–${MAX_MS} ms` });
          }
          if (timing.length) { const p = timingProblem(timing[0].raw, timing[0].value); if (p) problems.push({ where: where(r, d), msg: p }); }
          else if (!get('transition-timing-function').length && times.length && times[0].ms >= 1) problems.push({ where: where(r, d), msg: `transition "${item}" has no timing function: it defaults to ease` });
          for (const u of unknown) problems.push({ where: where(r, d), msg: `cannot resolve ${u.raw} in transition "${item}"`, soft: true });
        }
      } else if (d.prop === 'transition-property') {
        for (const p of splitTop(d.value, ',')) { const v = resolveVars(p, vars) || p; if (!/^none$/i.test(v) && !allowedProperty(v)) problems.push({ where: where(r, d), msg: `transition-property ${v}` }); }
      } else if (d.prop === 'transition-duration' || d.prop === 'animation-duration') {
        for (const p of splitTop(d.value, ',')) {
          const ms = evalTime(resolveVars(p, vars) ?? '');
          if (ms == null) { problems.push({ where: where(r, d), msg: `cannot resolve ${d.prop} ${p}`, soft: true }); continue; }
          if (d.prop === 'animation-duration' && isAgd) { facts.agdCycle = ms; if (ms === CYCLE_MS || (ms >= MIN_MS && ms <= MAX_MS)) continue; }
          if (ms >= 1 && (ms < MIN_MS || ms > MAX_MS)) problems.push({ where: where(r, d), msg: `${d.prop} ${p} = ${ms} ms outside ${MIN_MS}–${MAX_MS} ms${isAgd ? ` (and not the ${CYCLE_MS} ms cycle)` : ''}` });
        }
      } else if (d.prop === 'transition-timing-function' || d.prop === 'animation-timing-function') {
        for (const p of splitTop(d.value, ',')) { const pr = timingProblem(p, resolveVars(p, vars)); if (pr) problems.push({ where: where(r, d), msg: pr }); }
      } else if (d.prop === 'animation') {
        if (/^none$/i.test(d.value.trim())) continue;
        facts.animations++;
        for (const item of splitTop(d.value, ',')) {
          const toks = splitTop(item, ' ').map((t) => classify(t, vars));
          const names = toks.filter((t) => t.kind === 'ident' && !ANIM_KEYWORDS.has(t.value.toLowerCase()) && !/^\d/.test(t.value));
          const times = toks.filter((t) => t.kind === 'time');
          const timing = toks.filter((t) => t.kind === 'timing');
          const iter = toks.find((t) => t.kind === 'ident' && t.value.toLowerCase() === 'infinite');
          if (names.length && isAgd) facts.agdNames.add(names[0].value);
          if (!times.length) problems.push({ where: where(r, d), msg: `animation "${item}" has no duration` });
          else {
            const ms = times[0].ms;
            const ok = ms < 1 || (ms >= MIN_MS && ms <= MAX_MS) || (isAgd && ms === CYCLE_MS);
            if (isAgd && ms === CYCLE_MS) facts.agdCycle = ms;
            if (!ok) problems.push({ where: where(r, d), msg: `animation duration ${times[0].raw} = ${ms} ms outside ${MIN_MS}–${MAX_MS} ms` });
          }
          if (iter && !isAgd) problems.push({ where: where(r, d), msg: `infinite animation outside the living surface (.agd)` });
          if (timing.length) { const p = timingProblem(timing[0].raw, timing[0].value); if (p) problems.push({ where: where(r, d), msg: p }); }
          else if (!get('animation-timing-function').length) problems.push({ where: where(r, d), msg: `animation "${item}" has no timing function: it defaults to ease` });
        }
      } else if (d.prop === 'animation-name') {
        if (isAgd) for (const n of splitTop(d.value, ',')) if (n !== 'none') facts.agdNames.add(n);
      } else if (d.prop === 'animation-iteration-count') {
        if (/infinite/i.test(d.value) && !isAgd) problems.push({ where: where(r, d), msg: 'infinite animation outside the living surface (.agd)' });
      }
    }
  }

  // --- keyframes: properties, per-frame timing functions, and the movements of the agenda cycle
  const kfs = all.filter((r) => r.kind === 'keyframes');
  facts.keyframes = kfs.length;
  for (const k of kfs) {
    const bad = new Set();
    for (const f of k.frames) for (const d of f.decls) {
      if (d.prop === 'animation-timing-function') { const p = timingProblem(d.value, resolveVars(d.value, vars)); if (p) problems.push({ where: `${k.file}:${d.line} @keyframes ${k.name} ${f.selector}`, msg: p }); continue; }
      if (d.prop === 'offset' || d.prop === 'animation-composition') continue;
      if (!allowedProperty(d.prop)) bad.add(d.prop);
    }
    if (bad.size) problems.push({ where: `${k.file}:${k.line} @keyframes ${k.name}`, msg: `animates ${[...bad].join(', ')}` });
  }
  const cycle = facts.agdCycle || CYCLE_MS;
  for (const name of facts.agdNames) {
    const k = kfs.find((x) => x.name === name);
    if (!k) { problems.push({ where: `@keyframes ${name}`, msg: 'used by .agd but not defined' }); continue; }
    const frames = [];
    for (const f of k.frames) for (const sel of splitTop(f.selector, ',')) {
      const o = /^from$/i.test(sel) ? 0 : /^to$/i.test(sel) ? 1 : parseFloat(sel) / 100;
      const props = {};
      for (const d of f.decls) if (d.prop !== 'animation-timing-function') props[d.prop] = d.value.replace(/\s+/g, ' ').trim();
      frames.push({ o, props });
    }
    for (const m of movements(frames, cycle)) {
      if (m.ms < MIN_MS || m.ms > MAX_MS) problems.push({ where: `${k.file}:${k.line} @keyframes ${k.name}`, msg: `movement of ${m.prop} from ${(m.from * 100).toFixed(1)}% to ${(m.to * 100).toFixed(1)}% of the ${cycle} ms cycle lasts ${Math.round(m.ms)} ms (allowed ${MIN_MS}–${MAX_MS} ms)` });
    }
  }
  return { problems, facts };
}

// frames: [{o: 0..1, props: {prop: value}}]. A movement is a run of consecutive keyframe segments in
// which the property changes; holds (equal values) separate movements. Missing 0 % / 100 % frames
// take the underlying value, which counts as a value of its own.
export function movements(frames, cycleMs) {
  const byProp = new Map();
  for (const f of frames) for (const [p, v] of Object.entries(f.props)) {
    if (!byProp.has(p)) byProp.set(p, []);
    byProp.get(p).push({ o: f.o, v });
  }
  const out = [];
  for (const [prop, list] of byProp) {
    list.sort((a, b) => a.o - b.o);
    if (list[0].o > 0) list.unshift({ o: 0, v: '<underlying>' });
    if (list[list.length - 1].o < 1) list.push({ o: 1, v: '<underlying>' });
    let start = null;
    for (let i = 1; i < list.length; i++) {
      const changes = list[i].v !== list[i - 1].v;
      if (changes && start == null) start = list[i - 1].o;
      if (!changes && start != null) { out.push({ prop, from: start, to: list[i - 1].o, ms: (list[i - 1].o - start) * cycleMs }); start = null; }
    }
    if (start != null) out.push({ prop, from: start, to: list[list.length - 1].o, ms: (list[list.length - 1].o - start) * cycleMs });
  }
  return out.filter((m) => m.ms > 0 || m.to > m.from);
}

// ------------------------------------------------------------------ JavaScript
// rAF only in the hero field (nain.js); no steps(), no other bezier, WAAPI with an allowed easing,
// no inline style transitions/animations outside the rules.
export function checkMotionJs(files) {
  const problems = [];
  const info = [];
  for (const [file, src] of Object.entries(files)) {
    const lines = src.split('\n');
    lines.forEach((l, n) => {
      const at = `${file}:${n + 1}`;
      const code = l.replace(/\/\/.*$/, '');
      if (/requestAnimationFrame\s*\(/.test(code)) {
        if (/(^|\/)nain\.js$/.test(file)) info.push(`${at} requestAnimationFrame (hero field file)`);
        else problems.push({ where: at, msg: `requestAnimationFrame outside the hero field: ${l.trim().slice(0, 90)}` });
      }
      if (/steps\s*\(/.test(code)) problems.push({ where: at, msg: `steps(): ${l.trim().slice(0, 90)}` });
      for (const m of code.matchAll(/cubic-bezier\([^)]*\)/g)) if (!allowedEasing(m[0])) problems.push({ where: at, msg: `easing ${m[0]}` });
      for (const m of code.matchAll(/easing\s*:\s*(['"])([^'"]+)\1/g)) if (!allowedEasing(m[2]) && !/var\(--ease-(out|std)\)/.test(m[2])) problems.push({ where: at, msg: `WAAPI easing '${m[2]}'` });
      if (/\.animate\s*\(/.test(code) && !/easing/.test(lines.slice(n, n + 6).join(' '))) problems.push({ where: at, msg: 'Element.animate() without an easing: it defaults to linear' });
      for (const m of code.matchAll(/(?:style\.(?:transition|animation)\s*=|setProperty\(\s*['"](?:transition|animation)['"]\s*,)\s*(['"])([^'"]*)\1/g)) problems.push({ where: at, msg: `inline ${m[0].slice(0, 80)}`, soft: true });
    });
  }
  return { problems, info };
}
