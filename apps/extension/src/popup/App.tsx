import React, { useState } from 'react';
import { Snippet } from '@fillin/shared';
import { useSnippets } from '../hooks/useSnippets';
import { snippetService } from '../services';
import { SnippetList } from '../components/SnippetList';
import { SnippetForm } from '../components/SnippetForm';
import { Plus } from 'lucide-react';

export function App() {
  const { snippets, loading, error, createSnippet, updateSnippet, deleteSnippet } = useSnippets(snippetService);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNew = () => {
    setEditingSnippet(undefined);
    setView('form');
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setView('form');
  };

  const handleSave = async (trigger: string, content: string) => {
    if (editingSnippet) {
      await updateSnippet(editingSnippet.id, trigger, content);
    } else {
      await createSnippet(trigger, content);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      await deleteSnippet(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white text-gray-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 bg-purple-200 rounded-full mb-2"></div>
          <div className="text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white relative flex flex-col overflow-hidden">
      {view === 'list' ? (
        <>
          <div className="flex-1 overflow-hidden">
            <SnippetList
              snippets={snippets}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleNew}
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Snippet</span>
            </button>
          </div>
          {error && view === 'list' && (
            <div className="absolute top-2 left-2 right-2 bg-red-500 text-white text-xs p-2 rounded-lg text-center shadow-lg">
              {error}
            </div>
          )}
        </>
      ) : (
        <SnippetForm
          snippet={editingSnippet}
          onSave={handleSave}
          onCancel={() => setView('list')}
          error={error}
        />
      )}
    </div>
  );
}
