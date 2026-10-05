import { Snippet } from '@fillin/shared';
import { SnippetRepository } from './SnippetRepository';

const STORAGE_KEY = 'fillin_snippets';

export class WebStorageRepository implements SnippetRepository {
  async getAll(): Promise<Snippet[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read from localStorage', e);
      return [];
    }
  }

  async save(snippets: Snippet[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    } catch (e) {
      throw new Error('Failed to save to localStorage');
    }
  }
}
