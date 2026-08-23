// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.naindev.com',
  output: 'static',
  integrations: [sitemap(), mdx()],
  redirects: {
    '/casos/stealth-3d-ai.html': '/casos/stealth-3d-ai',
    '/casos/optimizacion-saas.html': '/casos/optimizacion-saas',
    '/blog/clean-architecture-3d.html': '/blog/clean-architecture-3d'
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
