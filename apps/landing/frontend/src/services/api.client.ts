/// <reference types="vite/client" />
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async joinWaitlist(email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      if (data?.code === 'CONFLICT') {
        throw new Error('DUPLICATE');
      }
      if (data?.code === 'VALIDATION_ERROR') {
        throw new Error('INVALID_EMAIL');
      }
      throw new Error('NETWORK_ERROR');
    }
  }
}

// In Vite, environment variables are exposed on import.meta.env
// We default to localhost:3000 for local development if not provided
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = new ApiClient(API_URL);
