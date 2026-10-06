import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

interface Props {
  trigger: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ trigger, onConfirm, onCancel }: Props) {
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
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      {/* Dialog card */}
      <div
        className="w-64 bg-white rounded-2xl p-5 animate-slide-up"
        style={{
          border: '1px solid #e5e7eb',
          boxShadow: '0 20px 40px -8px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-center text-sm font-bold text-gray-900 mb-1">Delete snippet?</h3>
        <p className="text-center text-xs text-gray-500 mb-5 leading-relaxed">
          <span className="font-mono font-semibold bg-gray-100 text-gray-700 border border-gray-200 px-1.5 py-0.5 rounded mx-0.5">
            {trigger}
          </span>
          {' '}will be permanently removed.
        </p>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-sm font-medium
                       bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-all focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-sm font-medium
                       bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all focus:outline-none"
            autoFocus
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-xs text-gray-300 mt-3">
          <kbd className="font-mono">Enter</kbd> to confirm · <kbd className="font-mono">Esc</kbd> to cancel
        </p>
      </div>
    </div>
  );
}
