import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import projects from '../../public/assets/data/projects.json';
import { defaultSEO } from '../utils/seo';
import { buildLlmsTxt, type LlmsLink } from '../utils/llms';
import { selectedProjects, workPath } from '../utils/projects';

// Machine-readable site summary for AI answer engines (specs/next-seo-discovery, DISC-001, DISC-002).
const site = 'https://www.naindev.com';
const absolute = (path: string): string => new URL(path, site).href;

export const GET: APIRoute = async () => {
  const [services, posts, work] = await Promise.all([
    getCollection('servicios', ({ data }) => data.draft !== true),
    getCollection('blog', ({ data }) => data.draft !== true),
    getCollection('work'),
  ]);

  const serviceLinks: LlmsLink[] = [...services]
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({ title: entry.data.title, url: absolute(`/servicios/${entry.id}/`), description: entry.data.description }));

  const workLinks: LlmsLink[] = work.map((entry) => ({
    title: entry.data.title,
    url: absolute(workPath(entry.data.project)),
    description: entry.data.description,
  }));

  const selectedIds = new Set(selectedProjects().map((project) => project.id));
  const projectLinks: LlmsLink[] = [...projects]
    .sort((a, b) => a.order - b.order)
    .filter((project) => project.links.length > 0 && !selectedIds.has(project.id))
    .map((project) => ({ title: project.title, url: project.links[0].url, description: project.summary }));

  const postLinks: LlmsLink[] = [...posts]
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((entry) => ({ title: entry.data.title, url: absolute(`/blog/${entry.id}/`), description: entry.data.description }));

  const body = buildLlmsTxt({
    siteName: defaultSEO.siteName,
    summary:
      'Personal site of Aitor Nain Mendoza Vallejo (NainDev), full stack software architect: deterministic conformance checks, Python and .NET backends, and AI with human review.',
    languageNote:
      'Page content is in Spanish. Every page also exists in English under /en/ (for example /servicios/ is /en/services/ and /blog/ is /en/blog/).',
    sections: [
      {
        title: 'Main pages',
        links: [
          { title: 'Home and profile', url: absolute('/'), description: defaultSEO.description },
          { title: 'Services', url: absolute('/servicios/'), description: 'Consulting services by problem: critical backends, AI architecture, 3D validation, performance.' },
          { title: 'Projects and demos', url: absolute('/proyectos/'), description: 'Public catalog with the real status of each project, demos and source code.' },
          { title: 'Blog', url: absolute('/blog/'), description: 'Technical articles on architecture, .NET, deterministic validation and generative AI.' },
          { title: 'Contact', url: absolute('/contacto/'), description: 'Book a 30-minute call or write by email.' },
        ],
      },
      { title: 'Services', links: serviceLinks },
      { title: 'Selected work', links: workLinks },
      { title: 'Projects and demos', links: projectLinks },
      { title: 'Blog articles', links: postLinks },
    ],
  });

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
