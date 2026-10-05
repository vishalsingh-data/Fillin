import { Snippet } from '@fillin/shared';
import { SnippetRepository } from './SnippetRepository';

const STORAGE_KEY = 'fillin_snippets';

export class ChromeStorageRepository implements SnippetRepository {
  async getAll(): Promise<Snippet[]> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      throw new Error('Chrome storage is not available');
    }
    
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve(result[STORAGE_KEY] || []);
      });
    });
  }

  async save(snippets: Snippet[]): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      throw new Error('Chrome storage is not available');
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: snippets }, () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve();
      });
    });
  }
}
