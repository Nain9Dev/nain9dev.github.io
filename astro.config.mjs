// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

const excludedSitemapPaths = new Set([
  '/privacidad/',
  '/recursos/gracias/',
  '/recursos/recomendacion/'
]);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.naindev.com',
  output: 'static',
  // Inline styles so first paint never waits for a stylesheet request (spec 031).
  build: {
    inlineStylesheets: 'always'
  },
  // github-dark-default keeps every token at 4.5:1 or more on its background (spec 033, A11Y-002).
  markdown: {
    shikiConfig: { theme: 'github-dark-default' }
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !excludedSitemapPaths.has(pathname) && !pathname.startsWith('/tecnologia/');
      }
    }),
    mdx()
  ],
  // Retired case studies (specs/007-remove-case-studies) point to the most related service.
  redirects: {
    '/casos': '/servicios/',
    '/casos/stealth-3d-ai': '/servicios/validacion-3d/',
    '/casos/stealth-3d-ai.html': '/servicios/validacion-3d/',
    '/casos/optimizacion-saas': '/servicios/optimizacion-rendimiento-apirest-dotnet/',
    '/casos/optimizacion-saas.html': '/servicios/optimizacion-rendimiento-apirest-dotnet/',
    '/tecnologia/ONNX': '/servicios/validacion-3d/',
    '/tecnologia/Kubernetes': '/servicios/optimizacion-rendimiento-apirest-dotnet/',
    '/tecnologia/.NET Core': '/servicios/optimizacion-rendimiento-apirest-dotnet/',
    '/blog/clean-architecture-3d.html': '/blog/clean-architecture-3d',
    '/servicios/renovacion-web': '/servicios/arquitectura-frontend-alto-rendimiento',
    '/servicios/renovacion-web.html': '/servicios/arquitectura-frontend-alto-rendimiento',
    // The work pages have no listing (specs/050-work-pages, WK-012): the bare hub goes back to the home cases.
    '/trabajo': '/#selected-work'
  }
});
