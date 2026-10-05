import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env';
import { waitlistRoutes } from './routes/waitlist.routes';
import { PRODUCT_NAME } from '@fillin/shared';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: env.NODE_ENV === 'development'
  });

  app.register(cors, {
    origin: env.CORS_ORIGIN
  });

  app.get('/health', async () => {
    return { status: 'ok', service: `${PRODUCT_NAME} Backend API` };
  });

  app.register(waitlistRoutes);

  return app;
}
