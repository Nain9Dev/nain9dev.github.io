import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Site aligned with the owner's GitHub and LinkedIn profiles. See specs/012-profile-coherence.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const readJson = async (file) => JSON.parse(await read(file));
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

const PUBLIC_REPOS = [
  'parametricad-ai', 'NainOrder', 'GameHaven', 'Microservicio-Notificaciones', 'API-Gestion-Financiera',
  'Gestion-Autoescuela-Python', 'SistemaOposicionesTAI', 'tai-study-system-js', 'pong-arcade-js',
  'orbe-runner-3d', 'NainConfigurator', 'HaveTickets',
];
const PRIVATE_COUNT = 8;
// Names of private products, partners and the employer that must never reach the catalog.
const CONFIDENTIAL = /\bDSE\b|Datum Statutum|\bE3C\b|\bRT-(?:FIN-)?\d+|Contrast|crm-platform|ProspectAI|NainWrite|Facturae|gha-local-runners|NainDriveSimulator|Avalisto|Fidelidade|Alcal[aá]|Torrej[oó]n/i;

test('COPY-010: the hero presents multi-domain conformance without industrial-scale claims', async () => {
  const hero = text(await read('src/components/home/Hero.astro'));
  assert.match(hero, /conformidad determinista/i);
  assert.match(hero, /primer dominio[^.]*3D/i);
  assert.doesNotMatch(hero, /escala industrial/i);
});

test('COPY-011: the hero stack line lists the current stack', async () => {
  const hero = await read('src/components/home/Hero.astro');
  assert.ok(hero.includes('Python · C# · FastAPI · .NET · PostgreSQL · SQL Server · Vue 3 · MCP'));
});

test('COPY-012: no self-assigned title is shown as market validation', async () => {
  const hero = await read('src/components/home/Hero.astro');
  assert.doesNotMatch(hero, /Validaci[oó]n de mercado|🏆/);
});

test('COPY-013: the tech stack lists the default stack with existing icons', async () => {
  const { categories } = await readJson('public/assets/data/tech-stack.json');
  const items = categories.flatMap((category) => category.items);
  const names = new Set(items.map((item) => item.name));
  for (const name of ['Python', 'C#', 'TypeScript', 'FastAPI', 'Pydantic', '.NET', 'Vue 3', 'Tailwind CSS',
    'Astro', 'PostgreSQL', 'SQL Server', 'MCP', 'Docker', 'GitHub Actions']) {
    assert.ok(names.has(name), `tech stack lists ${name}`);
  }
  for (const item of items) await access(join(ROOT, 'public', item.icon));
});

test('COPY-014: terminal experience and stack match the verified roles', async () => {
  const commands = await readJson('public/assets/data/terminal-commands.json');
  const experience = text(commands.experience);
  assert.match(experience, /Desarrollador \.NET/);
  assert.match(experience, /sector asegurador/);
  for (const technology of ['.NET Framework', 'ASP.NET MVC 5', 'ASP.NET Web API 2', 'SQL Server', 'Dapper']) {
    assert.ok(experience.includes(technology), `experience lists ${technology}`);
  }
  assert.doesNotMatch(experience, /Avalisto|ASP\.NET Core/);
  const stack = text(commands.stack);
  for (const technology of ['Python', 'FastAPI', 'C#', 'Vue 3', 'PostgreSQL', 'SQL Server', 'MCP']) {
    assert.ok(stack.includes(technology), `stack lists ${technology}`);
  }
});

test('PRJ-001: the catalog lists every public project and the approved private ones', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const urls = projects.flatMap((project) => project.links.map((link) => link.url));
  for (const repo of PUBLIC_REPOS) {
    assert.ok(urls.includes(`https://github.com/Nain9Dev/${repo}`), `catalog links ${repo}`);
  }
  assert.equal(projects.filter((project) => project.private).length, PRIVATE_COUNT);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length, 'ids are unique');
  assert.equal(new Set(projects.map((project) => project.order)).size, projects.length, 'orders are unique');
});

test('PRJ-002: private entries have no links and no confidential names', async () => {
  const raw = await read('public/assets/data/projects.json');
  assert.doesNotMatch(raw, CONFIDENTIAL);
  for (const project of JSON.parse(raw).filter((entry) => entry.private)) {
    assert.deepEqual(project.links, [], `${project.id} has no links`);
  }
  const catalog = await read('public/assets/js/project-catalog.js');
  assert.match(catalog, /project\.private/);
});

test('PRJ-004: public live demos are linked from the catalog (specs/015-catalog-demo-links)', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const order = projects.find((project) => project.id === 'nainorder-ecommerce-api');
  assert.ok(order.links.some((link) => link.url === 'https://nainorder.onrender.com/index.html'));
  assert.match(order.status, /Demo pública/);
});

test('PRJ-003: the catalog carries no unverified performance figures', async () => {
  const raw = await read('public/assets/data/projects.json');
  assert.doesNotMatch(raw, /\d+\s?ms\b|latencia cero|[<>]\s?\d/i);
});

test('PRJ-005: the catalog includes the anonymous enterprise 3D viewer and updated CRM (specs/016-contrast-ecosystem-stack)', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const viewer = projects.find((project) => project.id === 'interactive-3d-viewer');
  assert.ok(viewer, 'interactive-3d-viewer exists');
  assert.equal(viewer.status, 'Privado · En producción');
  assert.deepEqual(viewer.links, []);
  assert.ok(viewer.technologies.includes('Three.js'));
  assert.ok(viewer.technologies.includes('TypeScript'));
  assert.ok(viewer.technologies.includes('Web Components'));

  const crm = projects.find((project) => project.id === 'collaborative-crm');
  assert.ok(crm, 'collaborative-crm exists');
  assert.equal(crm.status, 'Privado · En producción');
  assert.ok(crm.technologies.includes('TypeScript'));
});
