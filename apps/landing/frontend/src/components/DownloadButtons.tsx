import React from 'react';
import { Download, Puzzle } from 'lucide-react';

export const DownloadButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <a 
        href="/fillin-extension.zip"
        download="fillin-extension.zip"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
      >
        <Download size={20} />
        Download Locally
      </a>
      <button 
        disabled
        className="flex items-center gap-2 px-6 py-4 bg-gray-100 text-gray-500 rounded-full font-semibold border border-gray-200 cursor-not-allowed w-full sm:w-auto justify-center"
        title="Coming soon to the Chrome Web Store"
      >
        <Puzzle size={20} />
        Chrome Web Store (Coming Soon)
      </button>
    </div>
  );
};
