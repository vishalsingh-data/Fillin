import React, { useState, useRef } from 'react';
import { Snippet } from '@fillin/shared';
import { Search, Edit2, Trash2, Zap, Download, Upload, Sparkles, Shield, ShieldAlert } from 'lucide-react';

interface Props {
  snippets: Snippet[];
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLoadStarterPack?: () => Promise<void>;
  onImport?: (data: unknown[]) => Promise<{ imported: number; updated: number; skipped: number }>;
  onOpenBlacklistModal?: () => void;
  currentDomain?: string | null;
  isCurrentDomainBlacklisted?: boolean;
  onToggleCurrentDomain?: () => void;
}

export function SnippetList({
  snippets,
  onEdit,
  onDelete,
  searchQuery,
  setSearchQuery,
  onLoadStarterPack,
  onImport,
  onOpenBlacklistModal,
  currentDomain,
  isCurrentDomainBlacklisted,
  onToggleCurrentDomain,
}: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique sorted tags
  const allTags = Array.from(
    new Set(snippets.flatMap((s) => s.tags || []).filter(Boolean))
  ).sort();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = snippets.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.trigger.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)));

    const matchesTag = !selectedTag || (s.tags && s.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  const handleExport = () => {
    if (snippets.length === 0) {
      showToast('No snippets to export.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snippets, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fillin-snippets-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${snippets.length} snippet${snippets.length === 1 ? '' : 's'}`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        showToast('Invalid backup file format');
        return;
      }
      const res = await onImport(parsed);
      showToast(`Imported ${res.imported}, updated ${res.updated}`);
    } catch {
      showToast('Failed to parse JSON file');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-2 left-4 right-4 z-50 py-2 px-3 bg-gray-900 text-white text-xs font-medium rounded-xl shadow-lg text-center animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-2.5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          {/* Logo + wordmark */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm leading-none">F</span>
            </div>
            <span className="font-bold text-gray-900 tracking-tight">Fillin</span>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center space-x-1.5">
            {/* Snippet count pill */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
              <Zap className="w-3 h-3 text-gray-400" />
              <span>
                {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Import Button */}
            {onImport && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
                  title="Import snippets"
                  aria-label="Import snippets from JSON"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
              title="Export snippets"
              aria-label="Export snippets to JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Blacklist / Site Shield Button */}
            {onOpenBlacklistModal && (
              <button
                onClick={onOpenBlacklistModal}
                className={`p-1.5 rounded-lg transition-all focus:outline-none ${
                  isCurrentDomainBlacklisted
                    ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={
                  isCurrentDomainBlacklisted
                    ? `Fillin is PAUSED on ${currentDomain || 'this site'}. Click to manage.`
                    : 'Pause / Blacklist settings'
                }
                aria-label="Manage site blacklist and pause settings"
              >
                {isCurrentDomainBlacklisted ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Shield className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                       focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
            autoFocus
          />
        </div>

        {/* Paused on current site banner */}
        {isCurrentDomainBlacklisted && currentDomain && (
          <div className="mt-2.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2 min-w-0">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <p className="truncate text-xs text-amber-900">
                Paused on <span className="font-semibold">{currentDomain}</span>
              </p>
            </div>
            {onToggleCurrentDomain && (
              <button
                onClick={onToggleCurrentDomain}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline ml-2 flex-shrink-0"
              >
                Resume
              </button>
            )}
          </div>
        )}

        {/* Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex items-center space-x-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                selectedTag === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Snippet list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50/60">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-6 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 border border-gray-200">
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {snippets.length === 0 ? 'No snippets yet' : 'No results'}
            </p>
            <p className="text-xs text-gray-400 max-w-[210px] leading-relaxed mb-4">
              {snippets.length === 0
                ? 'Create your first snippet or load starter templates to begin typing faster.'
                : `Nothing matched "${searchQuery}".`}
            </p>

            {/* Load Starter Pack Button */}
            {snippets.length === 0 && onLoadStarterPack && (
              <button
                onClick={() => onLoadStarterPack()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-black transition-all shadow-sm focus:outline-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Load Starter Pack</span>
              </button>
            )}
          </div>
        ) : (
          filtered.map((snippet, i) => (
            <div
              key={snippet.id}
              className="group bg-white border border-gray-200 rounded-xl p-3 hover:border-gray-400 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] transition-all card-enter"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              {/* Top row: trigger + tags + actions */}
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-md">
                    {snippet.trigger}
                  </span>
                  {snippet.tags &&
                    snippet.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-200/80 px-1.5 py-0.5 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                </div>

                {/* Actions — appear on hover */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(snippet)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
                    title="Edit snippet"
                    aria-label="Edit snippet"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(snippet.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
                    title="Delete snippet"
                    aria-label="Delete snippet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content preview */}
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {snippet.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
