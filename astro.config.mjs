// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

const excludedSitemapPaths = new Set([
  '/privacidad/',
  '/recursos/gracias/'
]);

// https://astro.build/config
export default defineConfig({
  site: 'https://www.naindev.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !excludedSitemapPaths.has(pathname) && !pathname.startsWith('/tecnologia/');
      }
    }),
    mdx()
  ],
  redirects: {
    '/casos/stealth-3d-ai.html': '/casos/stealth-3d-ai',
    '/casos/optimizacion-saas.html': '/casos/optimizacion-saas',
    '/blog/clean-architecture-3d.html': '/blog/clean-architecture-3d',
    '/servicios/renovacion-web': '/servicios/arquitectura-frontend-alto-rendimiento',
    '/servicios/renovacion-web.html': '/servicios/arquitectura-frontend-alto-rendimiento'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('three')) {
              return 'vendor-three';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
});
