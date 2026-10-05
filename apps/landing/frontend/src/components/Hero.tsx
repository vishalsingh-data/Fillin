import React from 'react';
import { PRODUCT_NAME } from '@fillin/shared';
import { DownloadButtons } from './DownloadButtons';

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
        Fill in your own blanks.
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Create shortcuts for anything you type repeatedly. {PRODUCT_NAME} expands your custom snippets across the web instantly.
      </p>
      <div className="max-w-2xl mx-auto mb-6">
        <DownloadButtons />
      </div>
      <p className="text-sm text-gray-500 font-medium">Free forever. Local-first. Privacy focused.</p>
    </section>
  );
};
