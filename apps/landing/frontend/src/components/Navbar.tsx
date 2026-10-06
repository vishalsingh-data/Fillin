import React from 'react';
import { PRODUCT_NAME } from '@fillin/shared';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none mt-[1px]">F</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">{PRODUCT_NAME}</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#privacy" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
          </div>
          <div>
            <GitHubStarButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

const GitHubStarButton = () => {
  return (
    <>
      <style>{`
        @keyframes starPop {
          0%   { transform: scale(1) rotate(0deg); }
          30%  { transform: scale(1.5) rotate(-20deg); }
          60%  { transform: scale(0.9) rotate(12deg); }
          100% { transform: scale(1.2) rotate(0deg); }
        }
        @keyframes shimmer {
          0%   { left: -60%; }
          100% { left: 130%; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
          50%       { box-shadow: 0 0 0 5px rgba(245,158,11,0.25); }
        }
        .gh-star-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          border-radius: 9999px;
          border: 1.5px solid #e5e7eb;
          background: #ffffff;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          white-space: nowrap;
          user-select: none;
        }
        .gh-star-btn:hover {
          border-color: #f59e0b;
          background: #fffbeb;
          animation: glow-pulse 1.2s ease-in-out infinite;
        }
        .gh-star-icon-star {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          color: #9ca3af;
          transition: color 0.2s;
        }
        .gh-star-btn:hover .gh-star-icon-star {
          animation: starPop 0.5s cubic-bezier(.36,.07,.19,.97) both;
          color: #f59e0b;
        }
        .gh-star-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent);
          transform: skewX(-20deg);
          pointer-events: none;
        }
        .gh-star-btn:hover::after {
          animation: shimmer 0.55s ease forwards;
        }
        .gh-logo-icon {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          color: #374151;
        }
        .gh-divider {
          width: 1px;
          height: 14px;
          background: #e5e7eb;
          margin: 0 1px;
        }
        .gh-count {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }
        .gh-star-btn:hover .gh-count {
          color: #d97706;
        }
        .gh-label {
          transition: color 0.2s;
        }
        .gh-star-btn:hover .gh-label {
          color: #92400e;
        }
      `}</style>

      <a
        href="https://github.com/vishalsingh-data/Fillin"
        target="_blank"
        rel="noopener noreferrer"
        className="gh-star-btn"
        aria-label="Star Fillin on GitHub"
      >
        {/* GitHub Logo */}
        <svg viewBox="0 0 16 16" fill="currentColor" className="gh-logo-icon" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>

        {/* Star Icon (animates on hover) */}
        <svg viewBox="0 0 16 16" fill="currentColor" className="gh-star-icon-star" aria-hidden="true">
          <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.873 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
        </svg>

        <span className="gh-label">Star</span>
        <span className="gh-divider" aria-hidden="true" />
        <span className="gh-count">on GitHub</span>
      </a>
    </>
  );
};
