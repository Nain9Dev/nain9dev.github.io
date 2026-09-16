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
