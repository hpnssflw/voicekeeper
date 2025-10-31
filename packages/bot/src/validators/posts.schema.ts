import { z } from 'zod';

export const createPostSchema = z.object({
  botId: z.string().min(1),
  authorId: z.string().min(1),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(4096),
  type: z.enum(['text', 'image', 'gallery', 'poll']).default('text'),
  media: z
    .array(
      z.object({
        type: z.enum(['photo', 'video', 'document']),
        fileId: z.string().optional(),
        storageKey: z.string().optional(),
        caption: z.string().max(200).optional(),
        order: z.number().int().nonnegative().optional(),
      })
    )
    .optional(),
  buttons: z
    .array(
      z.object({
        text: z.string().min(1),
        action: z.enum(['url', 'post', 'web_app']),
        value: z.string().min(1),
        row: z.number().int().nonnegative().optional(),
      })
    )
    .max(10)
    .optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const listPostsQuerySchema = z.object({
  botId: z.string().min(1),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});


