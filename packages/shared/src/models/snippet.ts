import { z } from 'zod';

const TRIGGER_REGEX = /^\/[a-zA-Z0-9_-]+$/;

export const snippetSchema = z.object({
  id: z.string().min(1, "ID is required"),
  trigger: z.string().regex(TRIGGER_REGEX, "Trigger must begin with / and contain only letters, numbers, underscores, or hyphens"),
  content: z.string(),
  isHtml: z.boolean().optional(),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Snippet = z.infer<typeof snippetSchema>;
