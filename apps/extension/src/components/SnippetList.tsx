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
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(160deg, #0f0a1a 0%, #130d24 50%, #0d0a1f 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                boxShadow: '0 2px 10px rgba(139,92,246,0.4)',
              }}
            >
              <span className="text-white font-bold text-sm leading-none">F</span>
            </div>
            <span className="font-semibold text-white tracking-tight text-base">Fillin</span>
          </div>
          {/* Count badge */}
          <div
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#c4b5fd',
            }}
          >
            <Zap className="w-3 h-3" />
            <span>{snippets.length} snippet{snippets.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: 'rgba(196,181,253,0.5)' }}
          />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
            autoFocus
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-8 animate-fade-in">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              <Zap className="w-6 h-6" style={{ color: '#7c3aed' }} />
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              {snippets.length === 0 ? 'No snippets yet' : 'No results'}
            </p>
            <p className="text-xs" style={{ color: 'rgba(196,181,253,0.5)', maxWidth: 180 }}>
              {snippets.length === 0
                ? 'Create your first snippet and start typing faster.'
                : `No matches for "${searchQuery}".`}
            </p>
          </div>
        ) : (
          filtered.map((snippet, i) => (
            <div
              key={snippet.id}
              className="glass-card rounded-xl p-3 group snippet-card-enter"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Trigger tag */}
              <div className="flex items-start justify-between mb-1.5">
                <span
                  className="trigger-badge font-mono text-xs font-semibold px-2 py-0.5 rounded-md"
                >
                  {snippet.trigger}
                </span>
                {/* Action buttons — always visible on dark bg */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(snippet)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'rgba(196,181,253,0.5)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.2)';
                      (e.currentTarget as HTMLElement).style.color = '#c4b5fd';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(196,181,253,0.5)';
                    }}
                    title="Edit"
                    aria-label="Edit snippet"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(snippet.id)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'rgba(196,181,253,0.5)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
                      (e.currentTarget as HTMLElement).style.color = '#f87171';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(196,181,253,0.5)';
                    }}
                    title="Delete"
                    aria-label="Delete snippet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Content preview */}
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: 'rgba(241,240,255,0.55)' }}
              >
                {snippet.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
