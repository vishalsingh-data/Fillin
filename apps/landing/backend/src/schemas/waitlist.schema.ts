import { z } from 'zod';

export const waitlistSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email too long')
});

export type WaitlistDto = z.infer<typeof waitlistSchema>;
