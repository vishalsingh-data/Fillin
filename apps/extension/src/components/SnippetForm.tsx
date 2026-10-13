import React, { useState, useEffect, useMemo } from 'react';
import { Snippet } from '@fillin/shared';
import { ArrowLeft, Save, Hash, Tag, X, AlertTriangle, Info, Check } from 'lucide-react';

interface Props {
  snippet?: Snippet;
  existingSnippets?: Snippet[];
  onSave: (trigger: string, content: string, isHtml: boolean, tags?: string[]) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

export function SnippetForm({ snippet, existingSnippets, onSave, onCancel, error }: Props) {
  const [trigger, setTrigger] = useState(snippet?.trigger || '/');
  const [content, setContent] = useState(snippet?.content || '');
  const [isHtml, setIsHtml] = useState(snippet?.isHtml || false);
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(error || null);
  }, [error]);

  // Check duplicate and prefix conflicts in real time
  const conflict = useMemo(() => {
    const clean = trigger.trim();
    if (!clean || clean === '/' || !existingSnippets) {
      return { type: 'none' as const, message: '', suggestions: [] as string[] };
    }

    const otherSnippets = existingSnippets.filter((s) => s.id !== snippet?.id);

    // 1. Exact Duplicate Conflict
    const duplicate = otherSnippets.find((s) => s.trigger.toLowerCase() === clean.toLowerCase());
    if (duplicate) {
      const base = clean.startsWith('/') ? clean.slice(1) : clean;
      const suggestions = [
        `/${base}2`,
        `/${base}_alt`,
        `/my${base}`,
      ].filter((cand) => !otherSnippets.some((s) => s.trigger.toLowerCase() === cand.toLowerCase()));

      return {
        type: 'duplicate' as const,
        message: `Trigger "${clean}" already exists. Choose a unique shortcut.`,
        suggestions,
      };
    }

    // 2. Prefix / Overlap Conflict
    const prefixOverlap = otherSnippets.find(
      (s) =>
        (clean.toLowerCase().startsWith(s.trigger.toLowerCase()) && clean.length > s.trigger.length) ||
        (s.trigger.toLowerCase().startsWith(clean.toLowerCase()) && s.trigger.length > clean.length)
    );

    if (prefixOverlap) {
      const base = clean.startsWith('/') ? clean.slice(1) : clean;
      const suggestions = [
        `/${base}_`,
        `/${base}1`,
      ].filter((cand) => !otherSnippets.some((s) => s.trigger.toLowerCase() === cand.toLowerCase()));

      return {
        type: 'prefix' as const,
        message: `Shares prefix with "${prefixOverlap.trigger}". Longest trigger wins, but shorter triggers can cause early expansions.`,
        suggestions,
      };
    }

    return { type: 'none' as const, message: '', suggestions: [] as string[] };
  }, [trigger, existingSnippets, snippet]);

  const isValid = trigger && trigger !== '/' && content.trim().length > 0 && conflict.type !== 'duplicate';

  const handleAddTag = (val: string) => {
    const clean = val.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await onSave(trigger, content, isHtml, tags.length > 0 ? tags : undefined);
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

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-4 py-4 space-y-4 bg-gray-50/60 overflow-y-auto">
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
              onChange={(e) => {
                const val = e.target.value.replace(/\//g, '');
                setTrigger('/' + val);
              }}
              placeholder="email, name, sig..."
              className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-sm font-mono text-gray-900 placeholder-gray-400
                         focus:ring-4 outline-none transition-all shadow-xs ${
                           conflict.type === 'duplicate'
                             ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                             : conflict.type === 'prefix'
                             ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-100'
                             : 'border-gray-200 focus:border-gray-400 focus:ring-gray-100'
                         }`}
              autoFocus
            />
            {/* Live preview */}
            {trigger && trigger !== '/' && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded">
                {trigger}
              </span>
            )}
          </div>

          {/* Conflict Warnings & Alternative Suggestions */}
          {conflict.type === 'duplicate' && (
            <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 animate-fade-in space-y-1.5">
              <div className="flex items-start space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{conflict.message}</span>
              </div>
              {conflict.suggestions.length > 0 && (
                <div className="flex items-center space-x-1.5 pt-0.5 flex-wrap gap-y-1">
                  <span className="text-[11px] font-medium text-red-600">Suggested:</span>
                  {conflict.suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setTrigger(sug)}
                      className="px-1.5 py-0.5 font-mono text-[11px] font-semibold bg-white border border-red-200 text-red-800 rounded hover:bg-red-100 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {conflict.type === 'prefix' && (
            <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 animate-fade-in space-y-1.5">
              <div className="flex items-start space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{conflict.message}</span>
              </div>
              {conflict.suggestions.length > 0 && (
                <div className="flex items-center space-x-1.5 pt-0.5 flex-wrap gap-y-1">
                  <span className="text-[11px] font-medium text-amber-700">Alternative:</span>
                  {conflict.suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setTrigger(sug)}
                      className="px-1.5 py-0.5 font-mono text-[11px] font-semibold bg-white border border-amber-200 text-amber-800 rounded hover:bg-amber-100 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {conflict.type === 'none' && trigger && trigger !== '/' && (
            <p className="mt-1.5 text-xs text-emerald-600 flex items-center space-x-1">
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Trigger is available</span>
            </p>
          )}

          {(!trigger || trigger === '/') && (
            <p className="mt-1.5 text-xs text-gray-400">Type this anywhere to expand</p>
          )}
        </div>

        {/* Tags field */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
            Tags (Optional)
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => {
                if (tagInput.trim()) handleAddTag(tagInput);
              }}
              placeholder="Add tag and press Enter (e.g. email, work)..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400
                         focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none transition-all shadow-xs"
            />
          </div>

          {/* Tag Badges */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-200 text-gray-800"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="ml-1 text-gray-500 hover:text-gray-900 focus:outline-none"
                    aria-label={`Remove tag ${t}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content field */}
        <div className="flex-1 flex flex-col min-h-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
            Expansion
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="The text that will be inserted..."
            className="flex-1 w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400
                       focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none resize-none transition-all shadow-xs leading-relaxed"
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
                     disabled:cursor-not-allowed flex-shrink-0"
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
