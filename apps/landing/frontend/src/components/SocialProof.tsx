import React from 'react';
import { Star } from 'lucide-react';

export const SocialProof = () => {
  // Mock data for overlapping avatars
  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=ffdfbf',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=ffd5dc',
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-8 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
        
        {/* Avatars Section */}
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-3">
            {avatars.map((avatar, i) => (
              <img 
                key={i}
                src={avatar} 
                alt="Contributor avatar" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm hover:-translate-y-1 transition-transform duration-200"
                style={{ zIndex: avatars.length - i }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-gray-600">
            Trusted by <span className="font-bold text-gray-900">10,000+</span> open-source devs
          </p>
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block w-px h-8 bg-gray-200"></div>

        {/* GitHub Badge */}
        <a 
          href="https://github.com/vishalsingh-data/Fillin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center space-x-3 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold text-gray-900">500+</span>
            <span className="text-sm text-gray-600 font-medium">Stars</span>
          </div>
          <div className="flex items-center space-x-1 pl-2 border-l border-gray-300">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
        </a>

      </div>
    </div>
  );
};
