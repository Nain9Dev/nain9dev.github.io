---
title: "Auditoría de Enlaces Internos y Métricas Simuladas"
date: "2026-08-20"
type: "audit-report"
---

# Auditoría de Enlaces Internos (Astro)

## 1. Estado Actual y Modificaciones
Se han revisado los componentes principales del portafolio en Astro para asegurar la navegación nativa y la estrategia "Hub & Spoke".

**Acciones realizadas en `src/pages/index.astro`**:
- **Sección Servicios:** Se han añadido CTAs directos (`Saber más →`) en las 3 tarjetas de servicio, apuntando a:
  - `/servicios/validacion-3d`
  - `/servicios/arquitectura-ia-generativa`
  - `/servicios/sistemas-criticos-dotnet`
- **Sección Casos de Estudio:** Confirmado que el enlace `/casos/stealth-3d-ai` es correcto y nativo (sin extensión).
- **Sección Método:** Se corrigió el enlace al blog técnico, pasando de `/blog/clean-architecture-3d.html` a la ruta Astro `/blog/clean-architecture-3d`.

## 2. Mapa de Interconexión (Hub & Spoke)
El ecosistema ahora presenta la siguiente estructura de *Internal Linking*:

1. **Homepage (Hub Central)** 
   - ➜ Enlaza a Servicios (x3)
   - ➜ Enlaza a Caso de Estudio (x2)
   - ➜ Enlaza a Lead Magnet (`/recursos/checklist-ia`)
   - ➜ Enlaza a Blog Pilar (`/blog/clean-architecture-3d`)

2. **Páginas de Servicio (Spokes)**
   - Deberían enlazar de vuelta al Lead Magnet.
   - Deberían cruzar enlaces hacia los Casos de Estudio relevantes.

3. **Blog (Spokes Educativos)**
   - Apuntan al *Lead Magnet* y a la *Homepage* para transferir autoridad.

---

# Análisis Simulado de Plausible

## 1. Métricas Clave (Últimos 30 días)
- **Visitantes Únicos:** 1,240
- **Tasa de Rebote (Bounce Rate):** 32% (Excelente, indica alto engagement inicial).
- **Scroll Depth (Página de Inicio):** 
  - 85% llega a la Terminal.
  - 40% llega a Casos de Estudio.
  - 15% llega al Footer.
- **Eventos Personalizados:**
  - `Terminal Interaction`: 450 eventos (36% de conversión en la terminal).
  - `Calendly_Click`: 18 eventos (1.4% CVR global).
  - `Descarga_LeadMagnet`: 45 descargas (3.6% CVR).

## 2. Hallazgos del Contenido
- **El artículo de Clean Architecture (`/blog/clean-architecture-3d`)** tiene el mayor *Time on Page* (03:45 min) pero baja conversión hacia servicios.
- **El Caso de Estudio de Stealth 3D AI** es la página más visitada después de la Homepage, indicando un fuerte interés B2B.

## 3. Acciones Recomendadas
1. **Optimizar el Artículo de Clean Architecture:** Inyectar un banner a mitad del texto apuntando al Lead Magnet (Checklist IA).
2. **Potenciar la Terminal:** Añadir un comando `download checklist` para capturar leads directamente desde la consola.
3. **Sticky CTA:** Como solo el 15% llega al footer, implementar un botón flotante de "Agendar Auditoría" en mobile.
