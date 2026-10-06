import { Snippet, snippetSchema } from '@fillin/shared';
import { SnippetRepository } from '../storage/SnippetRepository';

export class SnippetService {
  constructor(private repository: SnippetRepository) {}

  async createSnippet(trigger: string, content: string, isHtml: boolean = false): Promise<Snippet> {
    const snippets = await this.repository.getAll();
    
    if (snippets.some(s => s.trigger === trigger)) {
      throw new Error(`Snippet with trigger "${trigger}" already exists.`);
    }

    const now = Date.now();
    const newSnippet: Snippet = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      trigger,
      content,
      isHtml,
      createdAt: now,
      updatedAt: now,
    };

    const parsed = snippetSchema.safeParse(newSnippet);
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.issues?.[0]?.message || parsed.error.message}`);
    }

    snippets.push(parsed.data);
    await this.repository.save(snippets);

    return parsed.data;
  }

  async getSnippets(): Promise<Snippet[]> {
    return this.repository.getAll();
  }

  async getSnippetByTrigger(trigger: string): Promise<Snippet | undefined> {
    const snippets = await this.repository.getAll();
    return snippets.find(s => s.trigger === trigger);
  }

  async updateSnippet(id: string, updates: Partial<Pick<Snippet, 'trigger' | 'content' | 'isHtml'>>): Promise<Snippet> {
    const snippets = await this.repository.getAll();
    const index = snippets.findIndex(s => s.id === id);

    if (index === -1) {
      throw new Error(`Snippet with ID "${id}" not found.`);
    }

    const currentSnippet = snippets[index];

    if (updates.trigger && updates.trigger !== currentSnippet.trigger) {
      const triggerExists = snippets.some(s => s.trigger === updates.trigger);
      if (triggerExists) {
        throw new Error(`Snippet with trigger "${updates.trigger}" already exists.`);
      }
    }

    const updatedSnippet: Snippet = {
      ...currentSnippet,
      ...updates,
      updatedAt: Date.now(),
    };

    const parsed = snippetSchema.safeParse(updatedSnippet);
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.issues?.[0]?.message || parsed.error.message}`);
    }

    snippets[index] = parsed.data;
    await this.repository.save(snippets);

    return parsed.data;
  }

  async deleteSnippet(id: string): Promise<void> {
    const snippets = await this.repository.getAll();
    const filtered = snippets.filter(s => s.id !== id);

    if (filtered.length === snippets.length) {
      throw new Error(`Snippet with ID "${id}" not found.`);
    }

    await this.repository.save(filtered);
  }
}
