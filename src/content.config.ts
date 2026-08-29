import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160, "El SEO description debe ser < 160 chars."),
    pubDate: z.date(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional().default([]),
    ogImage: z.string().optional().default('/assets/images/og-cover-v2.png'),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
  })
});

const casos = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/casos" }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional().default([]),
    techStack: z.array(z.string()),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional(),
    draft: z.boolean().default(false),
    order: z.number().default(99)
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
    draft: z.boolean().default(false),
    order: z.number().default(99)
  })
});

export const collections = { blog, casos, servicios };
