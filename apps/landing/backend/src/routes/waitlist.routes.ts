import { FastifyInstance } from 'fastify';
import { WaitlistController } from '../controllers/waitlist.controller';

export async function waitlistRoutes(fastify: FastifyInstance) {
  fastify.post('/api/waitlist', WaitlistController.join);
}
