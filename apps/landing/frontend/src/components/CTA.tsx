import React from 'react';
import { ArrowRight, Download } from 'lucide-react';

export const CTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-6">
          Ready to save time?
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          Join thousands of developers typing faster with Fillin.
        </p>
        <button className="flex mx-auto items-center justify-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-gray-200">
          <Download className="w-5 h-5" />
          <span>Add to Chrome</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </section>
  );
};
