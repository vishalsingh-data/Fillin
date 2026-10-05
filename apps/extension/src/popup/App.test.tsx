import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from './App';
import { InMemoryRepository } from '../storage/InMemoryRepository';

// Mock the services module
vi.mock('../services', async () => {
  const { SnippetService } = await import('../services/SnippetService');
  const { InMemoryRepository } = await import('../storage/InMemoryRepository');
  const repo = new InMemoryRepository();
  return {
    snippetService: new SnippetService(repo)
  };
});

import { snippetService } from '../services';

describe('Snippet Management UI', () => {
  beforeEach(async () => {
    // Reset the in-memory repository state
    const repo = snippetService['repository'] as unknown as InMemoryRepository;
    repo.shouldFail = false;
    await repo.save([]);
  });

  const setupSnippets = async () => {
    await snippetService.createSnippet('/email', 'test@example.com');
    await snippetService.createSnippet('/github', 'https://github.com/user');
  };

  it('renders snippets and empty state', async () => {
    render(<App />);
    
    // Initial loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Empty state
    await waitFor(() => {
      expect(screen.getByText('No snippets yet')).toBeInTheDocument();
    });

    // With snippets
    await setupSnippets();
    
    // Re-render to fetch new snippets
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('/email')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('/github')).toBeInTheDocument();
    });
  });

  it('searches snippets', async () => {
    await setupSnippets();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('/email')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    fireEvent.change(searchInput, { target: { value: 'github' } });

    expect(screen.queryByText('/email')).not.toBeInTheDocument();
    expect(screen.getByText('/github')).toBeInTheDocument();
  });

  it('creates a snippet with validation and duplicate checking', async () => {
    await setupSnippets();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('/email')).toBeInTheDocument();
    });

    // Click Create
    fireEvent.click(screen.getByText('Create Snippet'));
    
    expect(screen.getByText('New Snippet')).toBeInTheDocument();

    const triggerInput = screen.getAllByRole('textbox')[0]; // First textbox is trigger
    const contentInput = screen.getAllByRole('textbox')[1]; // Second is content
    
    // Test validation - duplicate
    fireEvent.change(triggerInput, { target: { value: '/email' } });
    fireEvent.change(contentInput, { target: { value: 'duplicate' } });
    fireEvent.click(screen.getByText('Save Snippet'));

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument();
    });

    // Test successful creation
    fireEvent.change(triggerInput, { target: { value: '/linkedin' } });
    fireEvent.click(screen.getByText('Save Snippet'));

    await waitFor(() => {
      expect(screen.getByText('/linkedin')).toBeInTheDocument(); // Back to list view
    });
  });

  it('edits a snippet', async () => {
    await setupSnippets();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('/email')).toBeInTheDocument();
    });

    // Click edit on the first snippet (email)
    const editButtons = screen.getAllByTitle('Edit snippet');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Snippet')).toBeInTheDocument();
    
    const contentInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(contentInput, { target: { value: 'updated@example.com' } });
    fireEvent.click(screen.getByText('Save Snippet'));

    await waitFor(() => {
      expect(screen.getByText('updated@example.com')).toBeInTheDocument();
    });
  });

  it('deletes a snippet', async () => {
    await setupSnippets();
    window.confirm = vi.fn(() => true); // Mock confirm dialog
    
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('/email')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete snippet');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('/email')).not.toBeInTheDocument();
      expect(screen.getByText('/github')).toBeInTheDocument();
    });
  });
});
