# Plan de Migración y Optimización de Imágenes (Astro)

## Auditoría Actual de Imágenes (Etiquetas `<img>` y Markdown)

Tras analizar recursivamente todos los archivos `.astro` y `.mdx` dentro de `src/`, se han encontrado las siguientes referencias a imágenes:

### 1. Imágenes en Componentes de Astro (Decorativas / UI)
- `src/components/Header.astro` (Línea 8): 
  `<img src="/assets/images/logo_horizontal.png" alt="NainDev Logo" class="brand-logo">`

### 2. Imágenes de Contenido (Casos, Blog, Servicios)
Actualmente, **no existen etiquetas `<img />` o `![]()` adicionales** dentro de la carpeta `src/content/` ni en las páginas de `src/pages/`. Esto significa que la mayor parte del peso visual de tu portafolio recae en el diseño CSS, el canvas 3D y elementos tipográficos, lo que es excelente para el rendimiento (Tiempos de carga reducidos).

## Plan de Migración a `<Image />`

Aunque solo tenemos una imagen clave (el logo), migrarla al componente `<Image />` (nativo de `astro:assets`) aportará el beneficio de la pre-optimización en build (transformación a WebP o AVIF).

### Fase 1 (Inmediata / Corto Plazo)
Dado el bajo volumen de imágenes, esta fase abarcaría el 100% de la migración:

1. **Reemplazo del Logo en el Header:**
   ```astro
   ---
   import { Image } from 'astro:assets';
   // El logo actual está en public/assets/images/, tendríamos que moverlo a src/assets/images/ para que Astro lo procese
   import logoHorizontal from '../assets/images/logo_horizontal.png'; 
   ---
   
   <Image 
     src={logoHorizontal} 
     alt="NainDev Logo" 
     class="brand-logo" 
     loading="eager" 
     fetchpriority="high"
   />
   ```
   *Nota: Se usa `loading="eager"` porque el logo está "above the fold" y debe cargar de inmediato.*

### Fase 2 (Próximos 30 a 60 días)
Esta fase aplicará para el contenido futuro:
1. **Configuración del Frontmatter para MDX:** Si añades imágenes a tus blogs/casos de estudio, debes importar el componente `<Image />` dentro de tus archivos `.mdx` o utilizar la integración `@astrojs/mdx` para que intercepte automáticamente la sintaxis `![]()` de Markdown y la transforme usando la optimización nativa.
2. **Reorganización de Carpetas:** Astro requiere que las imágenes a optimizar residan en la ruta `src/assets/` en lugar de `public/assets/`. Se deberán mover las imágenes estáticas a esta nueva estructura para que el servidor de Vite/Astro pueda localizarlas durante el build.

## Conclusión y Recomendación

Dado que **actualmente solo hay 1 imagen (el logo) exportada mediante una etiqueta `<img />` explícita**, **no es prioritario realizar la migración ahora mismo**. El coste de mover los assets de `public/` a `src/` e implementar la solución ahora es mayor que el beneficio marginal de optimizar una única imagen (que ya pesa muy poco). 

Se recomienda aplazar esta migración a la **Fase 2** (cuando decidas empezar a incluir capturas de pantalla, diagramas y otras imágenes pesadas dentro de los artículos del blog o casos de estudio).
