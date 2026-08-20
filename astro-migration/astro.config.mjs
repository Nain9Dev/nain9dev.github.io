// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://naindev.com',
  integrations: [sitemap()],
  redirects: {
    '/servicios/renovacion-web': '/servicios/auditoria-sistemas'
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
