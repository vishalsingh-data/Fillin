import React from 'react';

export const Privacy = () => {
  return (
    <section id="privacy" className="py-24 bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Radically Private</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
          Most text expanders want you to create an account and sync your keystrokes to their cloud. We don&apos;t.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold mb-2">No Servers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Fillin has no backend database. Everything is stored using Chrome&apos;s local storage.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold mb-2">No Tracking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">We do not track your typing, your websites, or your usage. We don&apos;t even have analytics.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h3 className="text-lg font-bold mb-2">No Accounts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Install it and start typing immediately. There is no onboarding or login wall.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
