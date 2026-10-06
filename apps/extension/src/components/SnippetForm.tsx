import React, { useState, useEffect } from 'react';
import { Snippet } from '@fillin/shared';
import { ArrowLeft, Save, Hash } from 'lucide-react';

interface Props {
  snippet?: Snippet;
  onSave: (trigger: string, content: string, isHtml: boolean) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

export function SnippetForm({ snippet, onSave, onCancel, error }: Props) {
  const [trigger, setTrigger] = useState(snippet?.trigger || '/');
  const [content, setContent] = useState(snippet?.content || '');
  const [isHtml, setIsHtml] = useState(snippet?.isHtml || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => { setLocalError(error || null); }, [error]);

  const isValid = trigger && trigger !== '/' && content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await onSave(trigger, content, isHtml);
      onCancel();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-slide-up">

      {/* ── Header ── */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <button
          onClick={onCancel}
          className="mr-3 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            {snippet ? 'Edit Snippet' : 'New Snippet'}
          </h2>
          <p className="text-xs text-gray-400">
            {snippet ? 'Update your shortcut' : 'Create a text shortcut'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-4 py-4 space-y-4 bg-gray-50/60">

        {/* Error */}
        {localError && (
          <div className="px-3 py-2.5 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-600 animate-fade-in">
            {localError}
          </div>
        )}

        {/* Trigger field */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
            Trigger
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={trigger.replace(/^\//, '')}
              onChange={e => {
                const val = e.target.value.replace(/\//g, '');
                setTrigger('/' + val);
              }}
              placeholder="email, name, sig..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono text-gray-900 placeholder-gray-400
                         focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none transition-all shadow-sm"
              autoFocus
            />
            {/* Live preview */}
            {trigger && trigger !== '/' && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded">
                {trigger}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-gray-400">Type this anywhere to expand</p>
        </div>

        {/* Content field */}
        <div className="flex-1 flex flex-col">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
            Expansion
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="The text that will be inserted..."
            className="flex-1 w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400
                       focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none resize-none transition-all shadow-sm leading-relaxed"
          />
          {content && (
            <p className="mt-1.5 text-xs text-gray-400">
              {content.length} character{content.length !== 1 ? 's' : ''}
            </p>
          )}
          
          {/* HTML Toggle */}
          <div className="mt-3 flex items-center">
            <input
              id="htmlToggle"
              type="checkbox"
              checked={isHtml}
              onChange={(e) => setIsHtml(e.target.checked)}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <label htmlFor="htmlToggle" className="ml-2 block text-xs text-gray-700">
              Interpret as Rich Text (HTML)
            </label>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-sm transition-all focus:outline-none
                     disabled:cursor-not-allowed"
          style={
            isValid && !isSubmitting
              ? { background: '#111827', color: '#ffffff', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.25)' }
              : { background: '#f3f4f6', color: '#9ca3af' }
          }
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{snippet ? 'Update Snippet' : 'Save Snippet'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
