import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().max(60, "SEO title must be <= 60 characters.").optional(),
    description: z.string().max(160, "SEO description must be <= 160 characters."),
    pubDate: z.date(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()).optional().default([]),
    ogImage: z.string().optional().default('/assets/images/og-cover-v2.png'),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
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
    ogImage: z.string().optional().default('/assets/images/og-cover-v2.png'),
    draft: z.boolean().default(false),
    renderTitle: z.boolean().default(true),
    order: z.number().default(99)
  })
});

export const collections = { blog, servicios };
