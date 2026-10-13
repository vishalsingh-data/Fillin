import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnippetForm } from './SnippetForm';
import { Snippet } from '@fillin/shared';

describe('SnippetForm Conflict & Duplicate Detection', () => {
  const existingSnippets: Snippet[] = [
    {
      id: '1',
      trigger: '/email',
      content: 'test@example.com',
      isHtml: false,
      createdAt: 1000,
      updatedAt: 1000,
    },
    {
      id: '2',
      trigger: '/sig',
      content: 'Best regards',
      isHtml: false,
      createdAt: 1000,
      updatedAt: 1000,
    },
  ];

  it('shows duplicate trigger warning and suggestions when exact match exists', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <SnippetForm
        existingSnippets={existingSnippets}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    const triggerInput = screen.getByPlaceholderText('email, name, sig...');
    fireEvent.change(triggerInput, { target: { value: 'email' } });

    expect(screen.getByText(/already exists/i)).toBeInTheDocument();
    // Verify suggestion pills exist
    expect(screen.getByText('/email2')).toBeInTheDocument();

    // Clicking suggestion updates the trigger
    fireEvent.click(screen.getByText('/email2'));
    expect(screen.queryByText(/already exists/i)).not.toBeInTheDocument();
  });

  it('shows prefix overlap warning when trigger is substring of existing trigger', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <SnippetForm
        existingSnippets={existingSnippets}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    const triggerInput = screen.getByPlaceholderText('email, name, sig...');
    // Type /e which is a prefix of /email
    fireEvent.change(triggerInput, { target: { value: 'e' } });

    expect(screen.getByText(/Shares prefix with "\/email"/i)).toBeInTheDocument();
  });

  it('allows saving when trigger is unique', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <SnippetForm
        existingSnippets={existingSnippets}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    const triggerInput = screen.getByPlaceholderText('email, name, sig...');
    const contentInput = screen.getByPlaceholderText('The text that will be inserted...');

    fireEvent.change(triggerInput, { target: { value: 'phone' } });
    fireEvent.change(contentInput, { target: { value: '+123456789' } });

    fireEvent.submit(screen.getByText('Save Snippet').closest('form')!);
    expect(onSave).toHaveBeenCalledWith('/phone', '+123456789', false, undefined);
  });
});
