import { Snippet } from '@fillin/shared';
import { SnippetRepository } from './SnippetRepository';

export class InMemoryRepository implements SnippetRepository {
  private snippets: Snippet[] = [];
  public shouldFail = false;

  async getAll(): Promise<Snippet[]> {
    if (this.shouldFail) throw new Error('Simulated storage read failure');
    return [...this.snippets];
  }

  async save(snippets: Snippet[]): Promise<void> {
    if (this.shouldFail) throw new Error('Simulated storage write failure');
    this.snippets = [...snippets];
  }
}
