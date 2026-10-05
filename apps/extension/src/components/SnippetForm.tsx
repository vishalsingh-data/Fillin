import React, { useState, useEffect } from 'react';
import { Snippet } from '@fillin/shared';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
  snippet?: Snippet;
  onSave: (trigger: string, content: string) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

export function SnippetForm({ snippet, onSave, onCancel, error }: Props) {
  const [trigger, setTrigger] = useState(snippet?.trigger || '/');
  const [content, setContent] = useState(snippet?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(error || null);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await onSave(trigger, content);
      onCancel();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center p-4 border-b border-gray-100">
        <button onClick={onCancel} className="mr-3 p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-800">{snippet ? 'Edit Snippet' : 'New Snippet'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-4">
        {localError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
            {localError}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Trigger</label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => {
              if (!e.target.value.startsWith('/')) {
                setTrigger('/' + e.target.value.replace(/\//g, ''));
              } else {
                setTrigger(e.target.value);
              }
            }}
            placeholder="/email"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none font-mono"
            autoFocus
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Expansion text..."
            className="flex-1 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !trigger || trigger === '/'}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Snippet'}</span>
        </button>
      </form>
    </div>
  );
}
