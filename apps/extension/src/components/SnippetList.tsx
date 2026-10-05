import React from 'react';
import { Snippet } from '@fillin/shared';
import { Search, Edit2, Trash2 } from 'lucide-react';

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
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            {snippets.length === 0 ? 'No snippets yet. Create one!' : 'No snippets match your search.'}
          </div>
        ) : (
          filtered.map(snippet => (
            <div key={snippet.id} className="group p-3 border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all bg-white relative">
              <div className="font-mono text-sm font-semibold text-purple-700 mb-1">{snippet.trigger}</div>
              <div className="text-sm text-gray-600 truncate">{snippet.content}</div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button 
                  onClick={() => onEdit(snippet)}
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(snippet.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
