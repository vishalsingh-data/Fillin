import React, { useState } from 'react';
import { Snippet } from '@fillin/shared';
import { useSnippets } from '../hooks/useSnippets';
import { snippetService } from '../services';
import { SnippetList } from '../components/SnippetList';
import { SnippetForm } from '../components/SnippetForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Plus } from 'lucide-react';

export function App() {
  const { snippets, loading, error, createSnippet, updateSnippet, deleteSnippet } = useSnippets(snippetService);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Confirm dialog state
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteSnippet = snippets.find(s => s.id === pendingDeleteId);

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

  // Instead of confirm(), open custom dialog
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteSnippet(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: 'linear-gradient(160deg, #0f0a1a 0%, #130d24 50%, #0d0a1f 100%)' }}
      >
        <div className="flex flex-col items-center space-y-3 animate-fade-in">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
              boxShadow: '0 0 24px rgba(139,92,246,0.4)',
            }}
          >
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div className="flex space-x-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: 'rgba(139,92,246,0.7)',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main layout ── */
  return (
    <div className="h-full relative flex flex-col overflow-hidden">
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

          {/* Footer CTA */}
          <div
            className="px-4 py-3"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(15,10,26,0.9)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <button
              onClick={handleNew}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-sm text-white focus:outline-none glow-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Snippet</span>
            </button>
          </div>

          {/* Error toast */}
          {error && (
            <div
              className="absolute top-3 left-3 right-3 px-3 py-2 rounded-xl text-xs font-medium text-center animate-fade-in"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
                backdropFilter: 'blur(8px)',
              }}
            >
              {error}
            </div>
          )}

          {/* Custom confirm dialog (rendered on top) */}
          {pendingDeleteId && pendingDeleteSnippet && (
            <ConfirmDialog
              trigger={pendingDeleteSnippet.trigger}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
