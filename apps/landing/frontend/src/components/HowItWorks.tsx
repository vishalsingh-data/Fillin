import React from 'react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Create a snippet',
      description: 'Define a short trigger like "/email" and the longer text it should expand into.'
    },
    {
      step: '02',
      title: 'Type it anywhere',
      description: 'Type your trigger in any text box on the web (emails, forms, github issues, etc).'
    },
    {
      step: '03',
      title: 'Press Ctrl + Space',
      description: 'Hit Ctrl + Space to instantly expand your shortcut into the full text.'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How it works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.step} className="relative p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="text-5xl font-black text-gray-100 mb-6">{step.step}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
