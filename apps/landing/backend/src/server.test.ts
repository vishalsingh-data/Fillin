import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from './app';
import { WaitlistService } from './services/waitlist.service';

describe('Backend API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    WaitlistService.reset();
  });

  describe('GET /health', () => {
    it('returns status ok', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('ok');
    });
  });

  describe('POST /api/waitlist', () => {
    it('accepts valid email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/waitlist',
        payload: {
          email: 'test@example.com'
        }
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('success');
    });

    it('rejects invalid email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/waitlist',
        payload: {
          email: 'not-an-email'
        }
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('error');
      expect(body.code).toBe('VALIDATION_ERROR');
    });

    it('rejects duplicate email', async () => {
      await app.inject({
        method: 'POST',
        url: '/api/waitlist',
        payload: { email: 'test@example.com' }
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/waitlist',
        payload: { email: 'test@example.com' }
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('error');
      expect(body.code).toBe('CONFLICT');
    });
  });
});
