import React from 'react';
import { Star, Github } from 'lucide-react';

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
          <Github className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
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
