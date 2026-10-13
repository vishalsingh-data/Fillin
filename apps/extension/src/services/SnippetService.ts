import { Snippet, snippetSchema } from '@fillin/shared';
import { SnippetRepository } from '../storage/SnippetRepository';

export const STARTER_SNIPPETS: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    trigger: '/today',
    content: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    tags: ['utility'],
    isHtml: false,
  },
  {
    trigger: '/shrug',
    content: '¯\\_(ツ)_/¯',
    tags: ['fun'],
    isHtml: false,
  },
  {
    trigger: '/meeting',
    content: "Thanks for reaching out! Let's schedule a quick 15-minute call: https://cal.com/your-link",
    tags: ['work', 'email'],
    isHtml: false,
  },
  {
    trigger: '/followup',
    content: "Hi there, just following up on our previous conversation to see if you have any updates!",
    tags: ['email'],
    isHtml: false,
  },
  {
    trigger: '/tableflip',
    content: '(╯°□°)╯︵ ┻━┻',
    tags: ['fun'],
    isHtml: false,
  },
];

export class SnippetService {
  constructor(private repository: SnippetRepository) {}

  async createSnippet(
    trigger: string,
    content: string,
    isHtml: boolean = false,
    tags?: string[]
  ): Promise<Snippet> {
    const snippets = await this.repository.getAll();

    if (snippets.some((s) => s.trigger === trigger)) {
      throw new Error(`Snippet with trigger "${trigger}" already exists.`);
    }

    const now = Date.now();
    const newSnippet: Snippet = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2),
      trigger,
      content,
      isHtml,
      tags: tags && tags.length > 0 ? tags : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const parsed = snippetSchema.safeParse(newSnippet);
    if (!parsed.success) {
      throw new Error(
        `Validation failed: ${parsed.error.issues?.[0]?.message || parsed.error.message}`
      );
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
    return snippets.find((s) => s.trigger === trigger);
  }

  async updateSnippet(
    id: string,
    updates: Partial<Pick<Snippet, 'trigger' | 'content' | 'isHtml' | 'tags'>>
  ): Promise<Snippet> {
    const snippets = await this.repository.getAll();
    const index = snippets.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Snippet with ID "${id}" not found.`);
    }

    const currentSnippet = snippets[index];

    if (updates.trigger && updates.trigger !== currentSnippet.trigger) {
      const triggerExists = snippets.some((s) => s.trigger === updates.trigger);
      if (triggerExists) {
        throw new Error(`Snippet with trigger "${updates.trigger}" already exists.`);
      }
    }

    const updatedSnippet: Snippet = {
      ...currentSnippet,
      ...updates,
      tags: updates.tags !== undefined ? (updates.tags.length > 0 ? updates.tags : undefined) : currentSnippet.tags,
      updatedAt: Date.now(),
    };

    const parsed = snippetSchema.safeParse(updatedSnippet);
    if (!parsed.success) {
      throw new Error(
        `Validation failed: ${parsed.error.issues?.[0]?.message || parsed.error.message}`
      );
    }

    snippets[index] = parsed.data;
    await this.repository.save(snippets);

    return parsed.data;
  }

  async deleteSnippet(id: string): Promise<void> {
    const snippets = await this.repository.getAll();
    const filtered = snippets.filter((s) => s.id !== id);

    if (filtered.length === snippets.length) {
      throw new Error(`Snippet with ID "${id}" not found.`);
    }

    await this.repository.save(filtered);
  }

  async importSnippets(
    incomingData: unknown[]
  ): Promise<{ imported: number; updated: number; skipped: number }> {
    if (!Array.isArray(incomingData)) {
      throw new Error('Import data must be a JSON array of snippets.');
    }

    const existing = await this.repository.getAll();
    const existingMap = new Map(existing.map((s) => [s.trigger, s]));

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const item of incomingData) {
      const parsed = snippetSchema.safeParse(item);
      if (!parsed.success) {
        skipped++;
        continue;
      }

      const snippet = parsed.data;
      if (existingMap.has(snippet.trigger)) {
        // Update existing snippet
        const curr = existingMap.get(snippet.trigger)!;
        existingMap.set(snippet.trigger, {
          ...curr,
          content: snippet.content,
          isHtml: snippet.isHtml,
          tags: snippet.tags,
          updatedAt: Date.now(),
        });
        updated++;
      } else {
        // Add new
        existingMap.set(snippet.trigger, {
          ...snippet,
          id: snippet.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)),
          createdAt: snippet.createdAt || Date.now(),
          updatedAt: Date.now(),
        });
        imported++;
      }
    }

    const result = Array.from(existingMap.values());
    await this.repository.save(result);

    return { imported, updated, skipped };
  }

  async loadStarterPack(): Promise<Snippet[]> {
    const existing = await this.repository.getAll();
    const existingTriggers = new Set(existing.map((s) => s.trigger));
    const now = Date.now();

    const added: Snippet[] = [];
    for (const starter of STARTER_SNIPPETS) {
      if (!existingTriggers.has(starter.trigger)) {
        const snippet: Snippet = {
          id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).substring(2),
          trigger: starter.trigger,
          content: starter.content,
          isHtml: starter.isHtml,
          tags: starter.tags,
          createdAt: now,
          updatedAt: now,
        };
        existing.push(snippet);
        added.push(snippet);
      }
    }

    if (added.length > 0) {
      await this.repository.save(existing);
    }

    return existing;
  }
}
