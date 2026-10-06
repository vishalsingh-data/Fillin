import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

interface Props {
  trigger: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ trigger, onConfirm, onCancel }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onConfirm, onCancel]);

  return (
    /* Backdrop */
    <div
      className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(5,3,12,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}
    >
      {/* Dialog card */}
      <div
        className="w-64 rounded-2xl p-5 animate-slide-up"
        style={{
          background: 'linear-gradient(145deg, #1a1030, #140e28)',
          border: '1px solid rgba(239,68,68,0.25)',
          boxShadow: '0 24px 48px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)',
              boxShadow: '0 4px 16px -4px rgba(239,68,68,0.3)',
            }}
          >
            <Trash2 className="w-5 h-5" style={{ color: '#f87171' }} />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-center font-semibold text-white text-sm mb-1">Delete snippet?</h3>
        <p className="text-center text-xs mb-5" style={{ color: 'rgba(196,181,253,0.5)' }}>
          <span
            className="font-mono px-1.5 py-0.5 rounded mx-0.5"
            style={{
              background: 'rgba(139,92,246,0.15)',
              color: '#c4b5fd',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            {trigger}
          </span>{' '}
          will be permanently removed.
        </p>

        {/* Buttons */}
        <div className="flex space-x-2">
          {/* Cancel */}
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(196,181,253,0.7)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLElement).style.color = '#f1f0ff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(196,181,253,0.7)';
            }}
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          {/* Delete */}
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none"
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.25)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.5)';
              (e.currentTarget as HTMLElement).style.color = '#fca5a5';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px -4px rgba(239,68,68,0.35)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
              (e.currentTarget as HTMLElement).style.color = '#f87171';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            autoFocus
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* Hint */}
        <p className="text-center text-xs mt-3" style={{ color: 'rgba(196,181,253,0.2)' }}>
          Press <kbd style={{ fontFamily: 'monospace' }}>Enter</kbd> to confirm · <kbd style={{ fontFamily: 'monospace' }}>Esc</kbd> to cancel
        </p>
      </div>
    </div>
  );
}
