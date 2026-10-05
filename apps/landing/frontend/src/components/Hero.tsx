import React from 'react';
import { PRODUCT_NAME } from '@fillin/shared';
import { ArrowRight, Download } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
        Fill in your own blanks.
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Create shortcuts for anything you type repeatedly. {PRODUCT_NAME} expands your custom snippets across the web instantly.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-gray-200">
          <Download className="w-5 h-5" />
          <span>Add to Chrome</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>
      <p className="mt-6 text-sm text-gray-500 font-medium">Free forever. No account required.</p>
    </section>
  );
};
