import React, { useState, useEffect } from 'react';
import { Snippet } from '@fillin/shared';
import { ArrowLeft, Save, Hash } from 'lucide-react';

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

  const isValid = trigger && trigger !== '/' && content.trim().length > 0;

  return (
    <div
      className="flex flex-col h-full animate-slide-up"
      style={{ background: 'linear-gradient(160deg, #0f0a1a 0%, #130d24 50%, #0d0a1f 100%)' }}
    >
      {/* Header */}
      <div
        className="flex items-center px-4 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={onCancel}
          className="mr-3 p-1.5 rounded-lg transition-all focus:outline-none"
          style={{ color: 'rgba(196,181,253,0.6)', background: 'rgba(255,255,255,0.05)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.15)';
            (e.currentTarget as HTMLElement).style.color = '#c4b5fd';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(196,181,253,0.6)';
          }}
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-semibold text-white text-sm tracking-tight">
            {snippet ? 'Edit Snippet' : 'New Snippet'}
          </h2>
          <p className="text-xs" style={{ color: 'rgba(196,181,253,0.4)' }}>
            {snippet ? 'Update your shortcut' : 'Create a text shortcut'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-4 py-4 space-y-4">
        {/* Error */}
        {localError && (
          <div
            className="px-3 py-2.5 rounded-xl text-xs font-medium animate-fade-in"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171',
            }}
          >
            {localError}
          </div>
        )}

        {/* Trigger field */}
        <div>
          <label
            className="block text-xs font-semibold mb-2 uppercase tracking-widest"
            style={{ color: 'rgba(196,181,253,0.6)' }}
          >
            Trigger
          </label>
          <div className="relative">
            <Hash
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: 'rgba(139,92,246,0.6)' }}
            />
            <input
              type="text"
              value={trigger.replace(/^\//, '')}
              onChange={(e) => {
                const val = e.target.value.replace(/\//g, '');
                setTrigger('/' + val);
              }}
              placeholder="email, sig, address..."
              className="form-input w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-mono"
              autoFocus
            />
            {/* Live preview of full trigger */}
            {trigger && trigger !== '/' && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(139,92,246,0.2)',
                  color: '#c4b5fd',
                  border: '1px solid rgba(139,92,246,0.3)',
                }}
              >
                {trigger}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs" style={{ color: 'rgba(196,181,253,0.35)' }}>
            Type this trigger anywhere to expand
          </p>
        </div>

        {/* Content field */}
        <div className="flex-1 flex flex-col">
          <label
            className="block text-xs font-semibold mb-2 uppercase tracking-widest"
            style={{ color: 'rgba(196,181,253,0.6)' }}
          >
            Expansion
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="The text that will be inserted when you type the trigger..."
            className="form-input flex-1 w-full p-3 rounded-xl text-sm resize-none leading-relaxed"
          />
          {content && (
            <p className="mt-1.5 text-xs" style={{ color: 'rgba(196,181,253,0.35)' }}>
              {content.length} character{content.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all focus:outline-none disabled:cursor-not-allowed"
          style={
            isValid && !isSubmitting
              ? {
                  background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                  boxShadow: '0 4px 20px -4px rgba(139,92,246,0.5)',
                }
              : {
                  background: 'rgba(139,92,246,0.2)',
                  color: 'rgba(196,181,253,0.4)',
                }
          }
          onMouseEnter={e => {
            if (isValid && !isSubmitting) {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px -4px rgba(139,92,246,0.7)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px -4px rgba(139,92,246,0.5)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 loading-spinner" fill="none" viewBox="0 0 24 24">
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
