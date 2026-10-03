# Image Optimization and Migration Strategy

## Current Image Audit
An audit across all `.astro` and `.mdx` templates under `src/` identifies the following image usage:

### 1. Template Components (UI / Branding)
- `src/components/Header.astro`:
  `<img src="/assets/images/logo_horizontal.png" alt="NainDev Logo" class="brand-logo">`

### 2. Content Collections
Content collections currently rely primarily on CSS styling, SVG icons, and WebGL rendering, keeping client-side payload low.

## Migration to `<Image />` Component

Migrating the primary brand asset to `astro:assets` `<Image />` enables build-time format optimization (WebP/AVIF) and explicit dimensions.

### Implementation Blueprint
```astro
---
import { Image } from 'astro:assets';
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

### Recommendation
Given that the single bitmap logo is already lightweight and pre-compressed, full migration of images into `src/assets/` will be scheduled alongside future rich media asset introductions (technical diagrams and case study graphics).
