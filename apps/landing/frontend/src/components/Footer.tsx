import React, { useState, useRef, useCallback } from 'react';

export const Footer = () => {
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = () => {
    setSpotlightPos(null);
  };

  const isHovered = spotlightPos !== null;
  const spotlightX = spotlightPos?.x ?? 0;
  const spotlightY = spotlightPos?.y ?? 0;

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 overflow-hidden relative select-none">
      {/* Top Tier: Clean Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <img src="/logo.svg" alt="Fillin Logo" className="w-6 h-6" />
          <span className="font-semibold text-gray-900 tracking-tight">Fillin</span>
        </div>
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Fillin. All rights reserved. Zero tracking.
        </div>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <a
            href="https://github.com/vishalsingh-data/Fillin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Bottom-Pinned Bleed Typography Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        className="relative w-full overflow-hidden flex justify-center items-end cursor-default pt-2 pb-0 pointer-events-auto"
        style={{
          marginBottom: '-3.5vw',
        }}
      >
        {/* Ambient Violet/Indigo Halo Glow following cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            background: isHovered
              ? `radial-gradient(circle 280px at ${spotlightX}px ${spotlightY}px, rgba(99, 102, 241, 0.18), transparent 70%)`
              : 'transparent',
          }}
        />

        {/* 1. Base Layer: Faint light gray text */}
        <h2 className="text-[21vw] font-black tracking-tighter text-gray-200/80 uppercase leading-none select-none text-center transform translate-y-[6%] transition-colors duration-150">
          FILLIN
        </h2>

        {/* 2. Spotlight Layer: Deep charcoal (#111827) masked by radial gradient at cursor */}
        <div
          className="absolute inset-0 flex justify-center items-end pointer-events-none transition-opacity duration-200 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            WebkitMaskImage: isHovered
              ? `radial-gradient(circle 220px at ${spotlightX}px ${spotlightY}px, black 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)`
              : 'none',
            maskImage: isHovered
              ? `radial-gradient(circle 220px at ${spotlightX}px ${spotlightY}px, black 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)`
              : 'none',
          }}
        >
          <h2
            className="text-[21vw] font-black tracking-tighter text-gray-900 uppercase leading-none select-none text-center transform translate-y-[6%]"
            aria-hidden="true"
          >
            FILLIN
          </h2>
        </div>
      </div>
    </footer>
  );
};
