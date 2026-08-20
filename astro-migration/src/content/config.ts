import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160, "El SEO description debe ser < 160 chars."),
    pubDate: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  })
});

const caseStudiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional(),
    order: z.number().default(99)
  })
});

export const collections = {
  'blog': blogCollection,
  'casos': caseStudiesCollection,
};
