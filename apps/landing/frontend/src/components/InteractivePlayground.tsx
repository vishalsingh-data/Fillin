import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Sparkles, Command } from 'lucide-react';

export const InteractivePlayground = () => {
  const [text, setText] = useState('Hey team,\n\nJust wanted to share my new contact info. You can reach me at /em1');
  const [showTooltip, setShowTooltip] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      
      const cursorPosition = e.currentTarget.selectionStart;
      const textBeforeCursor = text.substring(0, cursorPosition);
      const textAfterCursor = text.substring(cursorPosition);
      
      const words = textBeforeCursor.split(/\s/);
      const lastWord = words[words.length - 1];

      if (lastWord === '/em1') {
        const replacement = 'vishal@example.com';
        const newTextBeforeCursor = textBeforeCursor.substring(0, textBeforeCursor.length - lastWord.length) + replacement;
        setText(newTextBeforeCursor + textAfterCursor);
        setIsExpanded(true);
        setShowTooltip(false);

        // Flash effect
        if (textareaRef.current) {
          textareaRef.current.classList.add('ring-4', 'ring-purple-500/50');
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.classList.remove('ring-4', 'ring-purple-500/50');
            }
          }, 300);
        }
      }
    }
  };

  return (
    <section className="py-24 bg-white border-y border-gray-100 overflow-hidden relative">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-4">
            Try it right now.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            No installation required for this demo. Go to the end of the text and press <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-sm font-mono text-gray-900 mx-1">Ctrl + Space</kbd>.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Editor Window */}
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
            {/* Editor Header */}
            <div className="bg-gray-800/50 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center text-gray-400 text-sm font-mono space-x-2">
                <Terminal className="w-4 h-4" />
                <span>playground.txt</span>
              </div>
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>

            {/* Editor Body */}
            <div className="relative p-6">
              {showTooltip && (
                <div className="absolute top-16 right-10 bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg animate-bounce flex items-center space-x-2 z-20 pointer-events-none">
                  <Command className="w-4 h-4" />
                  <span>Put your cursor after '/em1' and hit Ctrl+Space!</span>
                  {/* Tooltip caret */}
                  <div className="absolute -bottom-2 right-8 w-4 h-4 bg-purple-600 transform rotate-45"></div>
                </div>
              )}

              {isExpanded && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center space-x-2 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Expanded instantly!</span>
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (e.target.value.endsWith('/em1')) {
                    setShowTooltip(true);
                  } else {
                    setShowTooltip(false);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full h-48 bg-transparent text-gray-300 font-mono text-lg resize-none outline-none focus:ring-0 leading-relaxed transition-all duration-300"
                spellCheck="false"
              />
            </div>

            {/* Editor Footer */}
            <div className="bg-gray-800/30 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-xs text-gray-500 font-mono">
              <div className="flex space-x-4">
                <span>UTF-8</span>
                <span>React</span>
              </div>
              <div>
                Shortcut mapping: <span className="text-purple-400 font-semibold">/em1</span> → <span className="text-gray-300">vishal@example.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
