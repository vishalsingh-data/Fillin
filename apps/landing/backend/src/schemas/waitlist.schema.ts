import { z } from 'zod';

export const waitlistSchema = z.object({
  email: z.string().email('Invalid email address')
});

export type WaitlistDto = z.infer<typeof waitlistSchema>;
