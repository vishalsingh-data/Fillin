import React from 'react';
import { WaitlistForm } from './WaitlistForm';

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
        <div className="max-w-md mx-auto">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
};
