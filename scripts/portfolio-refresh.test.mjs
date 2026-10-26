import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Live demos, Nain3D and catalog structured data. See specs/next-portfolio-refresh.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const readJson = async (file) => JSON.parse(await read(file));
const urlsOf = (project) => project.links.map((link) => link.url);

test('PRJ-020: public demos use the naindev.com subdomains', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const byId = Object.fromEntries(projects.map((project) => [project.id, project]));
  assert.ok(urlsOf(byId['nainorder-ecommerce-api']).includes('https://order.naindev.com/'));
  assert.ok(urlsOf(byId['financial-management-api']).includes('https://policy.naindev.com/'));
  assert.ok(urlsOf(byId['driving-school-management']).includes('https://drive.naindev.com/'));
  const raw = JSON.stringify(projects);
  assert.doesNotMatch(raw, /onrender\.com|azurewebsites\.net|streamlit\.app/);
});

test('PRJ-021: Nain3D is listed after ParametriCAD AI with its demo and repository', async () => {
  const projects = (await readJson('public/assets/data/projects.json')).sort((a, b) => a.order - b.order);
  const index = projects.findIndex((project) => project.id === 'nain3d-conformance-gateway');
  assert.equal(index, 4);
  assert.equal(projects[3].id, 'parametricad-ai');
  const nain3d = projects[index];
  assert.deepEqual(urlsOf(nain3d), ['https://3d.naindev.com/', 'https://github.com/Nain9Dev/Nain3D']);
  assert.ok(!nain3d.categories.includes('production'));
  assert.ok(!nain3d.private);
  const copy = [nain3d.title, nain3d.status, nain3d.summary, nain3d.proof].join(' ');
  assert.doesNotMatch(copy, /\b(showroom|configurador|visor)\b/i);
});

test('PRJ-022: NainNotify links its live demo and orders stay sequential', async () => {
  const projects = (await readJson('public/assets/data/projects.json')).sort((a, b) => a.order - b.order);
  const notify = projects.find((project) => project.id === 'notification-worker');
  assert.ok(urlsOf(notify).includes('https://notify.naindev.com/'));
  assert.deepEqual(projects.map((project) => project.order), projects.map((_, index) => index));
});

test('PRJ-023: NainProspect and NainWrite are public catalog entries', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const prospect = projects.find((project) => project.id === 'b2b-prospecting-pipeline');
  const write = projects.find((project) => project.id === 'local-rewriting-agent');
  assert.deepEqual(urlsOf(prospect), ['https://prospect.naindev.com/', 'https://github.com/Nain9Dev/NainProspect']);
  assert.deepEqual(urlsOf(write), ['https://write.naindev.com/', 'https://github.com/Nain9Dev/NainWrite']);
  assert.ok(!prospect.private && !write.private);
  assert.equal(projects.filter((project) => project.private).length, 6);
});

test('VIS-003: every live demo has a small lazy-loaded thumbnail on its card', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const live = projects.filter((project) => project.links.some((link) => /^https:\/\/[a-z0-9-]+\.naindev\.com(\/|$)/.test(link.url)));
  // 15 since PRJ-024 linked the NainLegacyModernizer demo (specs/next-portfolio-coverage).
  assert.equal(live.length, 15);
  for (const project of live) {
    assert.equal(project.thumbnail, `/assets/images/demos/${project.id}.webp`);
    const { size } = await stat(join(ROOT, 'public', project.thumbnail));
    assert.ok(size > 1000 && size < 30000, `${project.id} thumbnail weighs ${size} bytes`);
  }
  assert.ok(projects.filter((project) => project.private).every((project) => !project.thumbnail));
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /project\.thumbnail/);
  assert.match(view, /loading = "lazy"/);
  assert.match(view, /width = 640/);
});

test('VIS-001 and VIS-002: the home page shows a static live-demos strip', async () => {
  const home = await read('src/pages/index.astro');
  assert.match(home, /import LiveDemos from '\.\.\/components\/home\/LiveDemos\.astro'/);
  // HERO-021: the strip follows the hero directly.
  assert.ok(home.indexOf('<Hero />') < home.indexOf('<LiveDemos />'));
  assert.ok(home.indexOf('<LiveDemos />') < home.indexOf('<TerminalSection />'));
  const strip = await read('src/components/home/LiveDemos.astro');
  assert.match(strip, /projects\.json/);
  assert.match(strip, /naindev\\\.com/);
  assert.match(strip, /rel="noopener noreferrer"/);
  assert.match(strip, /translate="no"/);
  assert.doesNotMatch(strip, /<script|<iframe/);
});

test('ECO-020 and ECO-021: the home page lists the open repositories after the catalog', async () => {
  const home = await read('src/pages/index.astro');
  assert.ok(home.indexOf('<ProjectsSection />') < home.indexOf('<OpenEcosystem />'));
  assert.ok(home.indexOf('<OpenEcosystem />') < home.indexOf('<MethodSection />'));
  const section = await read('src/components/home/OpenEcosystem.astro');
  for (const repo of ['engineering-handbook', 'template-dotnet-clean-arch', 'template-fastapi-vue-clean-arch', 'brandbook', 'status', '.github']) {
    assert.ok(section.includes(`name: '${repo}'`), `${repo} is listed`);
  }
  assert.match(section, /https:\/\/github\.com\/Nain9Dev\/\$\{/);
  assert.match(section, /rel="noopener noreferrer"/);
  assert.match(section, /translate="no"/);
  assert.doesNotMatch(section, /<script|<iframe/);
});

// Every public repository with a link and a capture. See specs/next-portfolio-coverage.
test('PRJ-024: a catalogued repository with a live site links it first, with the active-demo status and its capture', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const modernizer = projects.find((project) => project.id === 'nain-legacy-modernizer');
  assert.deepEqual(urlsOf(modernizer), ['https://modernizer.naindev.com/', 'https://github.com/Nain9Dev/NainLegacyModernizer']);
  assert.equal(modernizer.links[0].label, 'Probar demo');
  assert.equal(modernizer.status, 'Demo pública activa');
  assert.equal(modernizer.thumbnail, '/assets/images/demos/nain-legacy-modernizer.webp');
  const small = await stat(join(ROOT, 'public/assets/images/demos/nain-legacy-modernizer-400.webp'));
  assert.ok(small.size > 500 && small.size <= 10000, `small capture weighs ${small.size} bytes`);
});

test('PRJ-025: every public catalog entry carries a picture; without a live site it is the README capture', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  for (const project of projects.filter((project) => !project.private)) {
    assert.ok(project.thumbnail, `${project.id} carries a picture`);
  }
  const validator = projects.find((project) => project.id === 'nain-mcp-validator');
  assert.equal(validator.thumbnail, '/assets/images/repos/nain-mcp-validator.webp');
  const { size } = await stat(join(ROOT, 'public', validator.thumbnail));
  assert.ok(size > 1000 && size < 30000, `README capture weighs ${size} bytes`);
});

test('ECO-022 and ECO-023: every ecosystem tile shows a capture and links the live site when one exists', async () => {
  const section = await read('src/components/home/OpenEcosystem.astro');
  const sites = { brandbook: 'https://brand.naindev.com/', status: 'https://status.naindev.com/' };
  const entries = [...section.matchAll(/\{ name: '([^']+)'(.*?)\},?\n/g)];
  assert.equal(entries.length, 6);
  for (const [, name, rest] of entries) {
    const thumbnail = rest.match(/thumbnail: '([^']+)'/)?.[1];
    assert.ok(thumbnail, `${name} has a capture`);
    const big = await stat(join(ROOT, 'public', thumbnail));
    const small = await stat(join(ROOT, 'public', thumbnail.replace(/\.webp$/, '-400.webp')));
    assert.ok(big.size > 1000 && big.size < 30000, `${name} capture weighs ${big.size} bytes`);
    assert.ok(small.size > 500 && small.size <= 10000, `${name} small capture weighs ${small.size} bytes`);
    const site = rest.match(/site: '([^']+)'/)?.[1];
    assert.equal(site, sites[name], `${name} links its live site only when it has one`);
    assert.ok(thumbnail.startsWith(site ? '/assets/images/demos/' : '/assets/images/repos/'), `${name} capture lives in the right folder`);
  }
  assert.match(section, /href=\{repository\.site \?\? `https:\/\/github\.com\/Nain9Dev\/\$\{repository\.name\}`\}/);
  assert.match(section, /<a class="repo-code" href=\{`https:\/\/github\.com\/Nain9Dev\/\$\{repository\.name\}`\} target="_blank" rel="noopener noreferrer"/);
  assert.match(section, /<img class="live-demo-thumb"[^>]*alt=""[^>]*width="400" height="225" loading="lazy" decoding="async"/);
  assert.doesNotMatch(section, /<script|<iframe/);
  const css = await read('src/styles/main.css');
  assert.match(css, /#open-ecosystem \.live-demo \{[^}]*aspect-ratio: 16 \/ 10;/);
  assert.match(css, /\.repo-code \{/);
  assert.match(css, /#open-ecosystem \.live-demo-host,\s*#open-ecosystem \.live-demo-tech \{[^}]*clip-path: inset\(50%\);/);
});

test('VIS-004: technology chips carry a decorative icon when the repository ships one', async () => {
  const icons = await read('src/scripts/tech-icons.js');
  const paths = [...icons.matchAll(/'(\/assets\/icons\/[\w.-]+\.svg)'/g)].map((match) => match[1]);
  assert.ok(paths.length >= 12, `${paths.length} icons mapped`);
  for (const path of paths) await stat(join(ROOT, 'public', path));
  const projects = await readJson('public/assets/data/projects.json');
  const used = projects.flatMap((project) => project.technologies);
  const mapped = used.filter((technology) => icons.includes(`'${technology}'`));
  assert.ok(mapped.length / used.length > 0.45, 'most technology tags have an icon');
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /techIcon/);
  assert.match(view, /alt = ""/);
});

test('VIS-005: the long proof text is folded behind a detail control and live demos carry a badge', async () => {
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /createElement\("details", "project-detail"\)/);
  assert.match(view, /message\('projectDetail'\)/);
  assert.match(view, /is-live/);
  const runtime = await readJson('src/i18n/runtime.json');
  assert.equal(runtime.projectDetail, 'Ver detalle');
  const css = await read('src/styles/main.css');
  assert.match(css, /\.project-status\.is-live::before/);
  assert.match(css, /\.project-detail summary/);
});

test('VIS-006: each service card leads with a decorative icon and the links use a shared class', async () => {
  const services = await read('src/components/home/ServicesSection.astro');
  const cards = services.match(/<article class="service-card"[\s\S]*?<\/article>/g);
  assert.equal(cards.length, 3);
  for (const card of cards) {
    assert.match(card, /<svg class="service-icon"[^>]*aria-hidden="true"/);
    assert.match(card, /<a class="card-link" href="\/servicios\//);
  }
  assert.doesNotMatch(services, /style=/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.service-icon\s*\{/);
  assert.match(css, /\.card-link\s*\{/);
});

test('VIS-007: the method steps form a connected timeline without inline styles', async () => {
  const method = await read('src/components/home/MethodSection.astro');
  assert.doesNotMatch(method, /style=/);
  assert.match(method, /class="method-cta"/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.step-list > li::before/);
  assert.match(css, /\.method-cta\s*\{/);
});

test('VIS-008: the about links are icon pills and the resource call to action has no inline styles', async () => {
  const about = await read('src/components/home/AboutSection.astro');
  const links = about.match(/<a class="social-pill"[\s\S]*?<\/a>/g);
  assert.equal(links.length, 4);
  for (const link of links) {
    assert.match(link, /<svg[^>]*aria-hidden="true"/);
    assert.match(link, /rel="noopener noreferrer"/);
  }
  for (const url of ['https://github.com/Nain9Dev', 'https://github.com/naindev-contrast3d', 'https://www.linkedin.com/in/aitor-nain-mendoza-vallejo/', 'https://x.com/Nain9Dev']) {
    assert.ok(about.includes(`href="${url}"`), `${url} stays linked`);
  }
  const impact = await read('src/components/home/ImpactMetrics.astro');
  assert.doesNotMatch(impact, /style=/);
  assert.match(impact, /class="resource-cta"/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.social-pill\s*\{/);
  assert.match(css, /\.resource-cta\s*\{/);
});

test('VIS-010: page titles stay readable and the service detail page has no inline style', async () => {
  const css = await read('src/styles/main.css');
  const rule = css.match(/\nh1\s*\{([^}]*)\}/)?.[1] ?? '';
  const max = Number(rule.match(/font-size:\s*clamp\([^,]+,[^,]+,\s*([\d.]+)rem\)/)?.[1]);
  assert.ok(max > 0 && max <= 4.8, `global h1 tops out at ${max}rem`);
  const detail = await read('src/pages/servicios/[categoria].astro');
  assert.doesNotMatch(detail, /style=/);
});

test('VIS-009: the footer shows specialties as chips and the services index has no inline styles', async () => {
  const footer = await read('src/components/Footer.astro');
  // The status dot colour moved to the green token in spec 045, so the footer has no inline style left.
  assert.equal(footer.match(/style=/g)?.length ?? 0, 0, 'the footer has no inline style');
  assert.match(footer, /class="footer-chip"/);
  assert.match(footer, /class="status-pill"/);
  const services = await read('src/pages/servicios/index.astro');
  assert.doesNotMatch(services, /style=/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.footer-chip\s*\{/);
  assert.match(css, /\.status-pill\s*\{/);
  assert.match(css, /\.page-cta\s*\{/);
});

test('HERO-022: the hero title is sized so summary and actions reach the first screen', async () => {
  const css = await read('src/styles/main.css');
  const rule = css.match(/\.hero h1\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(rule, /max-width:\s*(1[4-9]|2\d)ch/);
  const max = Number(rule.match(/font-size:\s*clamp\([^,]+,[^,]+,\s*([\d.]+)rem\)/)?.[1]);
  assert.ok(max > 0 && max <= 4.6, `hero title tops out at ${max}rem`);
});

test('HERO-020: the hero summary is at most two sentences and keeps its required terms', async () => {
  const hero = await read('src/components/home/Hero.astro');
  const summary = hero.match(/<p class="hero-summary"[^>]*>([\s\S]*?)<\/p>/)[1].replace(/\s+/g, ' ').trim();
  assert.ok((summary.match(/[.!?](\s|$)/g) ?? []).length <= 2, summary);
  assert.match(summary, /conformidad determinista/i);
  assert.match(summary, /primer dominio[^.]*3D/i);
  assert.match(summary, /Python y \.NET/);
  assert.match(summary, /revisión humana/i);
});

test('SEO-020: the home JSON-LD lists the catalog projects as an ItemList', async () => {
  const seo = await read('src/components/SEO.astro');
  assert.match(seo, /"@type": "ItemList"/);
  assert.match(seo, /projects\.json/);
  assert.match(seo, /isHome/);
});

test('VIS-011: the checklist and blog index pages are styled by classes, not inline styles', async () => {
  const checklist = await read('src/pages/recursos/checklist-ia.astro');
  const blog = await read('src/pages/blog/index.astro');
  assert.doesNotMatch(checklist, /style=/);
  assert.doesNotMatch(blog, /style=/);
  assert.match(checklist, /class="[^"]*\bcheck-list\b[^"]*"/);
  assert.match(checklist, /<!--email_off-->/);
  assert.match(checklist, /mailto:contact@naindev\.com/);
  assert.match(blog, /class="blog-card-link"|button-outline blog-action/);
  const css = await read('src/styles/main.css');
  for (const selector of ['.check-list', '.lead-layout', '.lead-card', '.blog-action', '.page-intro']) {
    assert.ok(css.includes(`${selector} {`) || css.includes(`${selector}\n`) || css.includes(`${selector},`), `${selector} is styled`);
  }
});

test('VIS-012: the 404, thank-you and technology pages are styled by classes, not inline styles', async () => {
  const css = await read('src/styles/main.css');
  const pages = {
    'src/pages/404.astro': ['page-intro', 'center-actions'],
    'src/pages/recursos/gracias.astro': ['lead-page', 'thanks-card', 'thanks-emoji'],
    'src/pages/tecnologia/[tech].astro': ['tech-grid', 'tech-link-card'],
  };
  for (const [file, classes] of Object.entries(pages)) {
    const source = await read(file);
    assert.doesNotMatch(source, /style=/, `${file} has no inline style`);
    for (const name of classes) {
      assert.ok(source.includes(name), `${file} uses ${name}`);
      assert.ok(css.includes(`.${name}`), `${name} is styled`);
    }
  }
  const thanks = await read('src/pages/recursos/gracias.astro');
  assert.ok(thanks.includes('https://calendly.com/aitornainmendozavallejo-ksez/30min?utm_source=gracias&utm_medium=website'));
});

test('VIS-013: proof strip and partnership cards lead with icons, the stack badges use a class', async () => {
  const proof = await read('src/components/home/ProofStrip.astro');
  assert.equal(proof.match(/<svg class="proof-icon"[^>]*aria-hidden="true"/g)?.length, 3);
  const partnership = await read('src/components/home/PartnershipSection.astro');
  assert.equal(partnership.match(/<svg class="service-icon"[^>]*aria-hidden="true"/g)?.length, 2);
  const stack = await read('src/components/home/TechStack.astro');
  assert.doesNotMatch(stack, /style=/);
  assert.match(stack, /class="tech-badge tech-link"/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.proof-icon\s*\{/);
  assert.match(css, /\.tech-link\s*\{/);
});

test('HERO-023: the hero shows what is offered as three icon tiles linked to the services', async () => {
  const hero = await read('src/components/home/Hero.astro');
  const tiles = hero.match(/<a class="offer-tile"[\s\S]*?<\/a>/g) ?? [];
  assert.equal(tiles.length, 3);
  // Visual order: title, offer tiles, actions, then the short summary.
  const at = (needle) => hero.indexOf(needle);
  assert.ok(at('<h1') < at('class="offer-row"') && at('class="offer-row"') < at('class="button-group"') && at('class="button-group"') < at('class="hero-summary"'));
  const summaryWords = hero.match(/<p class="hero-summary"[^>]*>([\s\S]*?)<\/p>/)[1].trim().split(/\s+/).length;
  assert.ok(summaryWords <= 25, `hero summary has ${summaryWords} words`);
  const targets = ['/servicios/sistemas-criticos-dotnet', '/servicios/arquitectura-ia-generativa', '/servicios/validacion-3d'];
  tiles.forEach((tile, index) => {
    assert.ok(tile.includes(`href="${targets[index]}"`), `tile ${index} links ${targets[index]}`);
    assert.match(tile, /<svg class="offer-icon"[^>]*aria-hidden="true"/);
    assert.match(tile, /<strong>[^<]+<\/strong>/);
  });
  assert.doesNotMatch(hero, /badge-icon|⚙️|🧪/, 'the emoji badges are gone');
  const css = await read('src/styles/main.css');
  assert.match(css, /\.offer-tile\s*\{/);
  assert.doesNotMatch(css, /\.trust-badges/, 'dead badge styles are removed');
});
