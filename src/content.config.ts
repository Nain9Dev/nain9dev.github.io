import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().max(60, "SEO title must be <= 60 characters.").optional(),
    description: z.string().max(160, "SEO description must be <= 160 characters."),
    pubDate: z.date(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional().default([]),
    ogImage: z.string().optional().default('/assets/images/og-cover-v5.jpg'),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
  })
});

// Work pages: one write-up per selected project of projects.json (specs/050-work-pages, WK-001).
const work = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/work" }),
  schema: z.object({
    project: z.string(),
    title: z.string().max(60, "SEO title must be <= 60 characters."),
    description: z.string().max(160, "SEO description must be <= 160 characters."),
    lead: z.string().max(220),
  })
});

const servicios = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/servicios" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional().default([]),
    icon: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    ogImage: z.string().optional().default('/assets/images/og-cover-v5.jpg'),
    draft: z.boolean().default(false),
    renderTitle: z.boolean().default(true),
    order: z.number().default(99)
  })
});

// Recommendations are published only with recorded consent (ADR-0008, spec: testimonials).
const testimonials = defineCollection({
  loader: file('src/data/testimonials.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    companyUrl: z.url().optional(),
    relationship: z.enum(['client', 'partner']),
    sourceUrl: z.url().optional(),
    date: z.coerce.date(),
    quote: z.string().min(20),
    status: z.enum(['pending', 'approved']).default('pending'),
    consent: z.object({
      granted: z.literal(true),
      date: z.coerce.date(),
      evidence: z.string().min(10),
    }),
  })
});

// Companies shown on the home are published only with their recorded authorization (specs/next-collaborators-bar, CLB-001).
const collaborators = defineCollection({
  loader: file('src/data/collaborators.json'),
  schema: z.object({
    name: z.string(),
    url: z.url({ protocol: /^https$/ }).optional(),
    logo: z.object({
      src: z.string().startsWith('/assets/images/collaborators/'),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      // An isotype says nothing to someone who does not know the brand: show the name next to it.
      withName: z.boolean().default(false),
    }).optional(),
    order: z.number().int().default(99),
    status: z.enum(['pending', 'approved']).default('pending'),
    authorization: z.object({
      granted: z.literal(true),
      date: z.coerce.date(),
      evidence: z.string().min(10),
    }),
  })
});

// Public profiles where anyone can read or leave an opinion about NainDev: linked, never embedded (CLB-006).
const reviewSources = defineCollection({
  loader: file('src/data/review-sources.json'),
  schema: z.object({
    name: z.string(),
    url: z.url({ protocol: /^https$/ }),
  })
});

export const collections = { blog, servicios, testimonials, work, collaborators, reviewSources };
