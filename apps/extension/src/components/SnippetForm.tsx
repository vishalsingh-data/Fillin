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
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="flex items-center p-5 border-b border-gray-100 bg-white">
        <button 
          onClick={onCancel} 
          className="mr-3 p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="font-semibold text-gray-900 tracking-tight">{snippet ? 'Edit Snippet' : 'New Snippet'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-5 space-y-5">
        {localError && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-200 shadow-sm">
            {localError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Trigger</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 font-mono text-gray-400 text-sm">/</span>
            <input
              type="text"
              value={trigger.replace(/^\//, '')}
              onChange={(e) => {
                const val = e.target.value.replace(/\//g, '');
                setTrigger('/' + val);
              }}
              placeholder="email"
              className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 outline-none transition-all shadow-sm"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Expansion text..."
            className="flex-1 w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 outline-none resize-none transition-all shadow-sm leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !trigger || trigger === '/'}
          className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Snippet'}</span>
        </button>
      </form>
    </div>
  );
}
