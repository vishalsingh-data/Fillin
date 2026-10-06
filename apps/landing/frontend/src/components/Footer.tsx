import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs leading-none">F</span>
          </div>
          <span className="font-semibold text-gray-900">Fillin</span>
        </div>
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Fillin. All rights reserved.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="https://github.com/vishalsingh-data/Fillin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
