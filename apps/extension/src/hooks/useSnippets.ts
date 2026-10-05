import { useState, useEffect, useCallback } from 'react';
import { Snippet } from '@fillin/shared';
import { SnippetService } from '../services/SnippetService';

export function useSnippets(service: SnippetService) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSnippets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getSnippets();
      setSnippets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load snippets');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  const createSnippet = async (trigger: string, content: string) => {
    try {
      setError(null);
      await service.createSnippet(trigger, content);
      await loadSnippets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create snippet');
      throw err;
    }
  };

  const updateSnippet = async (id: string, trigger: string, content: string) => {
    try {
      setError(null);
      await service.updateSnippet(id, { trigger, content });
      await loadSnippets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update snippet');
      throw err;
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      setError(null);
      await service.deleteSnippet(id);
      await loadSnippets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete snippet');
      throw err;
    }
  };

  return { snippets, loading, error, createSnippet, updateSnippet, deleteSnippet, reload: loadSnippets };
}
