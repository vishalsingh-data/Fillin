import React from 'react';
import { FolderOpen, Puzzle } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const InstallPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">How to Install Fillin</h1>
          <p className="text-lg text-gray-600">
            Follow these 3 simple steps to load the extension directly into Chrome.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl">
              1
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Extract the downloaded .zip</h3>
              <p className="text-gray-600 mb-4">
                You should have just downloaded <code className="bg-gray-100 px-2 py-1 rounded text-sm">fillin-extension.zip</code>. Unzip this file to a safe folder on your computer (like your Documents).
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                <FolderOpen className="w-5 h-5 text-gray-400" />
                <span>Keep this folder! Chrome needs it to run the extension.</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-black text-2xl">
              2
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Open Chrome Extensions</h3>
              <p className="text-gray-600 mb-4">
                Open a new tab in Chrome, type <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-900 font-bold select-all">chrome://extensions</code> in the address bar, and press Enter.
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200">
                  Developer mode
                </div>
                <span className="text-gray-600 text-sm">← Turn this <strong>ON</strong> in the top right corner.</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-black text-2xl">
              3
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Load the Unpacked Extension</h3>
              <p className="text-gray-600 mb-4">
                Click the <strong>"Load unpacked"</strong> button that appears in the top left. Select the unzipped folder from Step 1.
              </p>
              <div className="bg-gray-900 text-white p-4 rounded-xl flex items-center gap-4">
                <Puzzle className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="font-bold">You're all set!</div>
                  <div className="text-sm text-gray-400">Pin the Fillin icon in your browser toolbar to get started.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-12 text-center">
          <a href="/" className="inline-block text-gray-500 hover:text-gray-900 font-medium transition-colors">
            ← Back to home
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
