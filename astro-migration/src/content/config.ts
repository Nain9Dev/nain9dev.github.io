import { defineCollection, z } from 'astro:content';

const casosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  })
});

export const collections = {
  'casos': casosCollection,
};
