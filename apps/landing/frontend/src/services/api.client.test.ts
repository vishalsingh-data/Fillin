import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from './api.client';

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient('http://test.local');
    global.fetch = vi.fn();
  });

  it('joins waitlist successfully', async () => {
    // @ts-expect-error Mocking fetch
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });

    await expect(client.joinWaitlist('test@example.com')).resolves.not.toThrow();
    expect(global.fetch).toHaveBeenCalledWith('http://test.local/api/waitlist', expect.any(Object));
  });

  it('throws DUPLICATE error on conflict', async () => {
    // @ts-expect-error Mocking fetch
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ code: 'CONFLICT' })
    });

    await expect(client.joinWaitlist('test@example.com')).rejects.toThrow('DUPLICATE');
  });

  it('throws INVALID_EMAIL error on validation error', async () => {
    // @ts-expect-error Mocking fetch
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ code: 'VALIDATION_ERROR' })
    });

    await expect(client.joinWaitlist('not-an-email')).rejects.toThrow('INVALID_EMAIL');
  });

  it('throws NETWORK_ERROR on unexpected error', async () => {
    // @ts-expect-error Mocking fetch
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ code: 'UNKNOWN' })
    });

    await expect(client.joinWaitlist('test@example.com')).rejects.toThrow('NETWORK_ERROR');
  });
});
