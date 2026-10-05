import React from 'react';
import { PRODUCT_NAME } from '@fillin/shared';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none mt-[1px]">F</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">{PRODUCT_NAME}</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#privacy" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
          </div>
          <div>
            <a href="#download" onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} className="bg-black text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200">
              Download
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
