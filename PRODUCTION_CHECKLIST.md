# Checklist de Producción: naindev.com (Lanzamiento Astro)

**Fecha de Ejecución**: Agosto 2026
**Estado**: Completado (Verificación Estática y de Configuración)

Este documento detalla las verificaciones realizadas sobre la web desplegada en producción (`https://www.naindev.com`).

## 1. Redirecciones (Prevención de 404s)
✅ **Configuración Astro**: Verificada en `astro.config.mjs`.
*   `/casos/stealth-3d-ai.html` ➔ `/casos/stealth-3d-ai` (Correcto)
*   `/casos/optimizacion-saas.html` ➔ `/casos/optimizacion-saas` (Correcto)
*   `/blog/clean-architecture-3d.html` ➔ `/blog/clean-architecture-3d` (Correcto)
*   *Nota manual*: Se requiere comprobación en Cloudflare para asegurar que estas redirecciones aplican también si el usuario entra con `www` vs sin `www`.

## 2. Rendimiento y Carga de Assets (Islands Architecture)
✅ **Componente Three.js**:
*   El canvas (`hero-3d-canvas`) se renderiza correctamente.
*   El chunk de Three.js está separado vía Vite (`vendor-three`), evitando bloquear el hilo principal.
*   *Nota manual*: Comprobar FPS en dispositivos móviles usando Chrome DevTools (pestaña Rendering > Frame Rendering Stats).

✅ **Terminal Interactiva**:
*   Script `terminal.js` carga correctamente.
*   No pierde contexto entre navegaciones SPA gracias a la limpieza en `astro:before-swap` configurada en `app.js`.

✅ **View Transitions**:
*   FOUC (Flash of Unstyled Content) prevenido mediante script bloqueante (`.motion-ready`) en `BaseLayout.astro`.

## 3. SEO Técnico y Rastreo
✅ **Robots.txt & Sitemap**:
*   El archivo `/robots.txt` existe y permite el rastreo general (`User-agent: * Allow: /`).
*   El sitemap se genera dinámicamente mediante `@astrojs/sitemap` y se inyecta en el build.
*   Las etiquetas canonical están bien formadas en `SEO.astro`.
*   Los metadatos OpenGraph (imágenes absolutas) están listos para compartir en Twitter/LinkedIn.

## 4. Analítica (Plausible)
✅ **Eventos**:
*   Script proxy de Plausible carga correctamente (`data-domain="naindev.com"`).
*   Eventos personalizados de "Outbound Link" (hacia Calendly) y "Contacto" re-atados exitosamente tras cada `astro:page-load`.

## Recomendaciones para el QA Manual en Vivo:
- [ ] Entrar desde un iPhone/Safari para verificar que el WebGL no crashea la pestaña (límites de VRAM).
- [ ] Enviar un comando falso en la terminal para confirmar que muestra el error por defecto.
- [ ] Ejecutar un análisis de Lighthouse completo apuntando a la URL final de GitHub Pages.
