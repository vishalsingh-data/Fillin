import React from 'react';
import { Snippet } from '@fillin/shared';
import { Search, Edit2, Trash2, Zap } from 'lucide-react';

interface Props {
  snippets: Snippet[];
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function SnippetList({ snippets, onEdit, onDelete, searchQuery, setSearchQuery }: Props) {
  const filtered = snippets.filter(s =>
    s.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          {/* Logo + wordmark */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm leading-none">F</span>
            </div>
            <span className="font-bold text-gray-900 tracking-tight">Fillin</span>
          </div>

          {/* Snippet count pill */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
            <Zap className="w-3 h-3 text-gray-400" />
            <span>{snippets.length} snippet{snippets.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                       focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* ── Snippet list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50/60">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-10 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 border border-gray-200">
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {snippets.length === 0 ? 'No snippets yet' : 'No results'}
            </p>
            <p className="text-xs text-gray-400 max-w-[190px] leading-relaxed">
              {snippets.length === 0
                ? 'Create your first snippet and start typing faster.'
                : `Nothing matched "${searchQuery}".`}
            </p>
          </div>
        ) : (
          filtered.map((snippet, i) => (
            <div
              key={snippet.id}
              className="group bg-white border border-gray-200 rounded-xl p-3 hover:border-gray-400 hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] transition-all card-enter"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              {/* Top row: trigger + actions */}
              <div className="flex items-start justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-md">
                  {snippet.trigger}
                </span>

                {/* Actions — appear on hover */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(snippet)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
                    title="Edit"
                    aria-label="Edit snippet"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(snippet.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
                    title="Delete"
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
