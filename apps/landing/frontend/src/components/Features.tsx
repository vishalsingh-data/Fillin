import React from 'react';
import { Zap, Lock, Feather, Keyboard } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      name: 'Blazing Fast',
      description: 'Zero latency. Snippets expand instantly as you type because everything runs locally on your machine.',
      icon: Zap
    },
    {
      name: 'Local First & Private',
      description: 'Your snippets never leave your browser. No cloud syncing, no accounts, no trackers. 100% private.',
      icon: Lock
    },
    {
      name: 'Lightweight',
      description: 'Built with vanilla DOM adapters. No bloated frameworks injected into your web pages.',
      icon: Feather
    },
    {
      name: 'Works Everywhere',
      description: 'Supports standard inputs, textareas, and complex rich-text editors out of the box.',
      icon: Keyboard
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-4">
          Developer-grade performance
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          We stripped out the bloat to give you the fastest, most reliable text expander.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
        
        {/* Blazing Fast (Spans 2 columns) */}
        <div className="group md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:bg-gray-100 transition-colors overflow-hidden relative">
          <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-white rounded-full flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-24 h-24 text-gray-300" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Zap className="w-7 h-7 text-gray-900" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{features[0].name}</h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">{features[0].description}</p>
            </div>
          </div>
        </div>

        {/* Local First & Private (Spans 1 column) */}
        <div className="group md:col-span-1 bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:bg-black transition-colors overflow-hidden relative">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">{features[1].name}</h3>
              <p className="text-gray-400 leading-relaxed">{features[1].description}</p>
            </div>
          </div>
        </div>

        {/* Lightweight (Spans 1 column) */}
        <div className="group md:col-span-1 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Feather className="w-7 h-7 text-gray-900" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{features[2].name}</h3>
              <p className="text-gray-600 leading-relaxed">{features[2].description}</p>
            </div>
          </div>
        </div>

        {/* Works Everywhere (Spans 2 columns) */}
        <div className="group md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:bg-gray-100 transition-colors overflow-hidden relative">
           <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-white rounded-full flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform duration-500">
            <Keyboard className="w-24 h-24 text-gray-300" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Keyboard className="w-7 h-7 text-gray-900" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{features[3].name}</h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">{features[3].description}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
