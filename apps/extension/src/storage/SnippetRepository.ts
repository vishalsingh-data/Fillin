import { Snippet } from '@fillin/shared';

export interface SnippetRepository {
  getAll(): Promise<Snippet[]>;
  save(snippets: Snippet[]): Promise<void>;
}
