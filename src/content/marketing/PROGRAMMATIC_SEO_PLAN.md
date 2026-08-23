# Plan de Programmatic SEO a 90 Días

## 1. Estrategia y Objetivos
- Dominar el nicho de "Arquitectura Backend para Sistemas 3D e IA".
- Generar tráfico orgánico cualificado (CTOs, Tech Leads, Founders) mediante landing pages hiper-específicas de servicios.
- Coste de adquisición (CAC) orgánico: 0€.

## 2. Keywords y Estructura de Rutas
La carpeta `src/content/servicios/` actuará como generador de landing pages a través de la ruta dinámica `/servicios/[categoria]`.

### Keywords Objetivo Iniciales:
1. **Agentes IA C#** -> `/servicios/agentes-ia-csharp`
2. **Validación Modelos 3D Cloud** -> `/servicios/validacion-3d-cloud`
3. **Optimización Rendimiento .NET 8** -> `/servicios/optimizacion-rendimiento-dotnet`
4. **Backend Escabable Azure** -> `/servicios/backend-escalable-azure`
5. **Arquitectura Hexagonal C#** -> `/servicios/arquitectura-hexagonal-csharp`

## 3. Workflow de Creación
1. Duplicar `TEMPLATE_SERVICE.mdx`.
2. Nombrar el archivo con el slug SEO (ej. `agentes-ia-csharp.mdx`).
3. Completar el frontmatter estrictamente tipado (Zod fallará el build si falta algo).
4. Redactar el contenido siguiendo la estructura: Problema -> Solución -> Casos de uso.
5. Hacer commit y dejar que GitHub Actions despliegue a producción.

## 4. Próximos Pasos (Próximos 30 días)
- [ ] Crear las primeras 3 landing pages de servicios.
- [ ] Conectar los enlaces internos desde el index (`src/pages/index.astro`) y los posts del blog (`src/content/blog/`) hacia los nuevos servicios.
- [ ] Enviar el nuevo sitemap a Google Search Console.
