import React from 'react';
import { Snippet } from '@fillin/shared';
import { Search, Edit2, Trash2, Keyboard } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm leading-none mt-[1px]">F</span>
          </div>
          <h1 className="font-semibold text-gray-900 tracking-tight">Fillin</h1>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100/70 border border-transparent focus:bg-white focus:border-purple-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
            autoFocus
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 mt-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Keyboard className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {snippets.length === 0 ? 'No snippets yet' : 'No matches found'}
            </p>
            <p className="text-xs text-gray-500 max-w-[200px]">
              {snippets.length === 0 
                ? 'Create your first text snippet to start typing faster.' 
                : `We couldn't find any snippets matching "${searchQuery}".`}
            </p>
          </div>
        ) : (
          filtered.map(snippet => (
            <div key={snippet.id} className="group p-3.5 border border-gray-200/60 rounded-xl hover:border-purple-300 hover:shadow-[0_2px_12px_-4px_rgba(147,51,234,0.15)] transition-all bg-white relative">
              <div className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block mb-2">{snippet.trigger}</div>
              <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{snippet.content}</div>
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex space-x-1">
                <button 
                  onClick={() => onEdit(snippet)}
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                  title="Edit snippet"
                  aria-label="Edit snippet"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => onDelete(snippet.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Delete snippet"
                  aria-label="Delete snippet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
