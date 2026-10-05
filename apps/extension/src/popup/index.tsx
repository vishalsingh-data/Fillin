import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';

const Popup = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-6 bg-gradient-to-br from-purple-50 to-white">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-lg font-bold text-xl">
          F
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fillin</h1>
      </div>
      <p className="text-sm text-gray-500 font-medium text-center">
        Fill in your own blanks.
      </p>
      
      <div className="mt-8 p-4 bg-white shadow-sm rounded-xl border border-gray-100 text-center w-full">
        <p className="text-xs text-gray-400 italic">This is only a shell.</p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
