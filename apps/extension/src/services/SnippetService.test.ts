import { describe, it, expect, beforeEach } from 'vitest';
import { SnippetService } from './SnippetService';
import { InMemoryRepository } from '../storage/InMemoryRepository';

describe('SnippetService', () => {
  let repository: InMemoryRepository;
  let service: SnippetService;

  beforeEach(() => {
    repository = new InMemoryRepository();
    service = new SnippetService(repository);
  });

  describe('create', () => {
    it('should create a valid snippet successfully', async () => {
      const snippet = await service.createSnippet('/email', 'test@example.com');
      expect(snippet.trigger).toBe('/email');
      expect(snippet.content).toBe('test@example.com');
      expect(snippet.id).toBeDefined();

      const all = await service.getSnippets();
      expect(all).toHaveLength(1);
    });

    it('should prevent duplicate triggers', async () => {
      await service.createSnippet('/email', 'first');
      await expect(service.createSnippet('/email', 'second'))
        .rejects.toThrow('already exists');
    });

    it('should throw validation error on invalid trigger', async () => {
      await expect(service.createSnippet('email', 'no slash'))
        .rejects.toThrow('Validation failed');
    });
  });

  describe('read', () => {
    it('should get all snippets', async () => {
      await service.createSnippet('/a', 'A');
      await service.createSnippet('/b', 'B');
      const all = await service.getSnippets();
      expect(all).toHaveLength(2);
    });

    it('should get snippet by trigger', async () => {
      await service.createSnippet('/find_me', 'found');
      const snippet = await service.getSnippetByTrigger('/find_me');
      expect(snippet?.content).toBe('found');

      const missing = await service.getSnippetByTrigger('/missing');
      expect(missing).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update snippet content and update timestamp', async () => {
      const snippet = await service.createSnippet('/test', 'old');
      const updated = await service.updateSnippet(snippet.id, { content: 'new' });
      
      expect(updated.content).toBe('new');
      expect(updated.trigger).toBe('/test');
      expect(updated.updatedAt).toBeGreaterThanOrEqual(snippet.updatedAt);
    });

    it('should update trigger successfully', async () => {
      const snippet = await service.createSnippet('/test', 'content');
      const updated = await service.updateSnippet(snippet.id, { trigger: '/new_test' });
      
      expect(updated.trigger).toBe('/new_test');
    });

    it('should reject update if new trigger already exists', async () => {
      await service.createSnippet('/existing', 'A');
      const snippet2 = await service.createSnippet('/test', 'B');

      await expect(service.updateSnippet(snippet2.id, { trigger: '/existing' }))
        .rejects.toThrow('already exists');
    });

    it('should reject update if validation fails', async () => {
      const snippet = await service.createSnippet('/test', 'A');
      await expect(service.updateSnippet(snippet.id, { trigger: 'invalid' }))
        .rejects.toThrow('Validation failed');
    });

    it('should throw when updating non-existent snippet', async () => {
      await expect(service.updateSnippet('fake-id', { content: 'C' }))
        .rejects.toThrow('not found');
    });
  });

  describe('delete', () => {
    it('should delete existing snippet', async () => {
      const snippet = await service.createSnippet('/test', 'A');
      await service.deleteSnippet(snippet.id);
      
      const all = await service.getSnippets();
      expect(all).toHaveLength(0);
    });

    it('should throw when deleting non-existent snippet', async () => {
      await expect(service.deleteSnippet('fake-id'))
        .rejects.toThrow('not found');
    });
  });

  describe('storage failures', () => {
    it('should propagate read errors', async () => {
      repository.shouldFail = true;
      await expect(service.getSnippets()).rejects.toThrow('Simulated storage read failure');
    });

    it('should propagate write errors', async () => {
      repository.shouldFail = true;
      await expect(service.createSnippet('/test', 'A')).rejects.toThrow('Simulated storage read failure'); // Fails on initial read check
    });
  });
});
