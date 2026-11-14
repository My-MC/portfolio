import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { tags } from './data/tags';

const nonempty = z.string().trim().min(1);
const httpUrl = z
  .url()
  .refine(
    (value) => /^https?:\/\//.test(value),
    'HTTP(S) URLを指定してください',
  );
const tagList = z
  .array(z.string().refine((id) => Object.hasOwn(tags, id), '未定義のタグです'))
  .default([]);

const blog = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: nonempty,
        description: nonempty,
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        category: z.enum(['tech', 'event', 'diary']),
        tags: tagList,
        cover: image().optional(),
        coverAlt: nonempty.optional(),
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'coverにはcoverAltが必要です',
        path: ['coverAlt'],
      })
      .refine((data) => !data.updatedAt || data.updatedAt >= data.publishedAt, {
        message: '更新日は公開日以降にしてください',
        path: ['updatedAt'],
      }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: nonempty,
        description: nonempty,
        status: z.enum(['planning', 'active', 'completed', 'archived']),
        technologies: z.array(nonempty).default([]),
        tags: tagList,
        role: nonempty.optional(),
        award: nonempty.optional(),
        cover: image().optional(),
        coverAlt: nonempty.optional(),
        repositoryUrl: httpUrl.optional(),
        websiteUrl: httpUrl.optional(),
        featured: z.boolean().default(false),
        order: z.number().default(100),
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.cover || !!data.coverAlt, {
        message: 'coverにはcoverAltが必要です',
        path: ['coverAlt'],
      }),
});

export const collections = { blog, projects };
