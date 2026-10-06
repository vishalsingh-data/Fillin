import React from 'react';
import { PRODUCT_NAME } from '@fillin/shared';
import { DownloadButtons } from './DownloadButtons';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      
      {/* Floating Background Elements */}
      <div className="hidden lg:block absolute top-20 left-10 animate-[float_6s_ease-in-out_infinite] opacity-80 pointer-events-none" style={{ '--tw-rotate': '-6deg' } as any}>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-5 -rotate-6 hover:rotate-0 transition-transform duration-300">
          <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">/email</div>
          <div className="text-sm font-semibold text-gray-900">samprati@example.com</div>
        </div>
      </div>

      <div className="hidden lg:block absolute top-40 right-10 animate-[float_8s_ease-in-out_infinite_reverse] opacity-80 pointer-events-none" style={{ '--tw-rotate': '3deg' } as any}>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-5 rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">/zoom</div>
          <div className="text-sm font-semibold text-white">zoom.us/j/123456</div>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-20 left-1/4 animate-[float_7s_ease-in-out_infinite] opacity-60 pointer-events-none" style={{ '--tw-rotate': '12deg' } as any}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 rotate-12 scale-75">
          <div className="text-xs font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-md text-gray-600">Ctrl + Space</div>
        </div>
      </div>

      {/* Playful Sticker 1 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -ml-[280px] -mt-[60px] md:-ml-[380px] md:-mt-[80px] z-10 rotate-[-15deg] hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
        <div className="bg-yellow-300 text-yellow-900 font-bold text-sm px-4 py-2 rounded-full border-2 border-yellow-900 shadow-[3px_3px_0px_0px_rgba(113,63,18,1)]">
          100% Free! ✌️
        </div>
      </div>

      {/* Playful Sticker 2 */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-[220px] -mt-[50px] md:ml-[340px] md:-mt-[70px] z-10 rotate-[12deg] hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
        <div className="bg-blue-200 text-blue-900 font-bold text-sm px-4 py-2 rounded-full border-2 border-blue-900 shadow-[3px_3px_0px_0px_rgba(30,58,138,1)] flex items-center gap-1.5">
          Chrome Extension 🧩
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter text-gray-900 mb-8 leading-[0.95]">
          Fill in your <br className="hidden md:block" /> own blanks.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Create shortcuts for anything you type repeatedly. {PRODUCT_NAME} expands your custom snippets across the web instantly.
        </p>
        
        <div className="max-w-2xl mx-auto mb-10 transform hover:scale-105 transition-transform duration-300">
          <DownloadButtons />
        </div>
        
        <p className="text-xs md:text-sm text-gray-400 font-bold tracking-[0.2em] uppercase">
          Local-first • Privacy focused • Open Source
        </p>
      </div>

      {/* Custom Styles for Float Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(var(--tw-rotate, 0deg)); }
          50% { transform: translateY(-15px) rotate(var(--tw-rotate, 0deg)); }
          100% { transform: translateY(0px) rotate(var(--tw-rotate, 0deg)); }
        }
      `}} />
    </section>
  );
};
