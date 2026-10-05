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
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Developer-grade performance</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We stripped out the bloat to give you the fastest, most reliable text expander.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {features.map((feature) => (
          <div key={feature.name} className="flex space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-gray-900" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
