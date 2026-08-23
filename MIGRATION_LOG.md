# Log de Migración a Astro

## Despliegue a Producción

- **Fecha de Despliegue:** 23 de Agosto de 2026
- **URL de Producción:** [https://www.naindev.com](https://www.naindev.com)
- **Versión de Astro:** v5.2.5
- **Commit:** `d23e539 Migración completa a Astro v5.2.5 con rutas dinámicas y colecciones MDX`
- **Enlace al Workflow (GitHub Actions):** [Ver en GitHub](https://github.com/Nain9Dev/nain9dev.github.io/actions)

## Checklist de Verificación Post-Despliegue

- [x] La home carga correctamente (texto, imágenes, canvas 3D, terminal).
- [x] Las rutas dinámicas funcionan:
  - `/casos/stealth-3d-ai`
  - `/casos/optimizacion-saas`
  - `/servicios/auditoria-sistemas`
  - `/servicios/renovacion-web`
  - `/servicios/arquitectura-ia-generativa`
  - `/servicios/validacion-3d`
  - `/servicios/sistemas-criticos-dotnet`
  - `/blog/clean-architecture-dotnet-ia`
  - `/blog/validacion-3d-backend-csharp`
  - `/recursos/checklist-ia`
- [x] Los estilos y scripts se aplican sin errores 404 en la consola del navegador.
- [x] La terminal interactiva responde a comandos (ej. `help`).
- [x] El canvas 3D se renderiza correctamente.
- [x] Los enlaces internos apuntan a rutas sin extensión `.html`.
- [x] Las redirecciones 301 (ej. `.html` -> sin extensión) funcionan.
- [x] El sitio es responsive y se ve bien en móvil.
- [x] Lighthouse (en producción) muestra puntuaciones > 90 en rendimiento, accesibilidad y SEO.

## Tareas de Mejora Post-Despliegue Pendientes

- [ ] Asegurar la reinicialización de Plausible y Terminal en `BaseLayout.astro` con `astro:page-load` (View Transitions).
- [ ] Mejorar Open Graph y Twitter Cards en el componente `SEO.astro`.
- [ ] Optimizar imágenes (migrar a `<Image />` de Astro para WebP y Lazy Loading nativo).
