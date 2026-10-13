import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Zap, Play, Pause } from 'lucide-react';

export const CommandPaletteShowcase = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sequence:
  // 0: Typing text in browser
  // 1: Shortcut lights up (Cmd+Shift+K)
  // 2: Palette opens
  // 3: Search query typed into palette
  // 4: Snippet highlighted
  // 5: Expansion inserted & stats flash
  useEffect(() => {
    if (!isPlaying) return;

    const timings = [1400, 700, 600, 1000, 600, 2200];
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % 6);
    }, timings[step]);

    return () => clearTimeout(timer);
  }, [step, isPlaying]);

  const mockSnippets = [
    { trigger: '/meeting', tags: ['work', 'calendar'], content: "Let's schedule a quick 15-min call: cal.com/alex" },
    { trigger: '/followup', tags: ['email'], content: "Hi! Following up on our chat earlier this week." },
    { trigger: '/shrug', tags: ['fun'], content: '¯\\_(ツ)_/¯' },
    { trigger: '/today', tags: ['utility'], content: 'Oct 13, 2026' },
  ];

  const displayedSnippets = step >= 3 
    ? mockSnippets.filter(s => s.trigger.includes('meet') || s.tags.includes('work'))
    : mockSnippets;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>New in Fillin 2.0</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
          Never memorize a trigger again.
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed font-medium">
          Forgot whether it was <code className="font-mono bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">/meet</code> or <code className="font-mono bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">/calendar</code>? 
          Hit <kbd className="px-2 py-0.5 bg-gray-900 text-white rounded-md text-xs font-mono shadow-sm mx-1">⌘ Shift K</kbd> anywhere on the web for an instant Spotlight search.
        </p>
      </div>

      {/* Interactive Mockup Container */}
      <div className="max-w-4xl mx-auto relative rounded-3xl bg-gradient-to-b from-gray-100 to-gray-50 p-3 sm:p-6 border border-gray-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)]">
        
        {/* Play / Pause toggle */}
        <div className="flex items-center justify-between pb-4 px-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
            <span className="text-xs text-gray-400 font-mono ml-2">in-browser demonstration</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Shortcut pill indicator */}
            <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-300 flex items-center space-x-1.5 ${
              step === 1 ? 'bg-amber-400 text-black shadow-lg scale-105 ring-4 ring-amber-200' : 'bg-white border border-gray-200 text-gray-600'
            }`}>
              <span>⌘</span>
              <span>Shift</span>
              <span>K</span>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 text-gray-400 hover:text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors focus:outline-none"
              title={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Browser viewport simulation */}
        <div className="relative bg-white rounded-2xl border border-gray-200 min-h-[360px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm">
          
          {/* Active mock textarea / document */}
          <div className="relative z-10">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Compose Email · Notion · Slack · Anywhere</span>
              {step === 5 && (
                <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold animate-fade-in">
                  <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  <span>+48 keystrokes saved!</span>
                </span>
              )}
            </div>

            <div className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50/50 min-h-[100px] text-base text-gray-800 font-normal leading-relaxed">
              <span>Hey Vishal, are you free tomorrow afternoon? </span>
              {step < 5 ? (
                <span className="inline-block w-2 h-4 bg-gray-900 ml-0.5 animate-pulse align-middle" />
              ) : (
                <span className="bg-emerald-50 text-emerald-950 font-medium px-1.5 py-0.5 rounded border border-emerald-200/80 animate-fade-in inline-block">
                  Let's schedule a quick 15-min call: cal.com/alex
                </span>
              )}
            </div>
          </div>

          {/* Floating Command Palette (Visible in steps 2, 3, 4) */}
          {(step >= 2 && step <= 4) && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/30 backdrop-blur-[3px] animate-fade-in">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all animate-slide-up">
                
                {/* Palette Search Header */}
                <div className="flex items-center px-4 py-3 border-b border-gray-100 space-x-2.5">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 font-mono text-sm text-gray-900 flex items-center">
                    {step >= 3 ? (
                      <span>meet</span>
                    ) : (
                      <span className="text-gray-400">Search snippets or #tags...</span>
                    )}
                    <span className="w-1.5 h-4 bg-gray-900 ml-0.5 animate-pulse inline-block" />
                  </div>
                </div>

                {/* Palette Results List */}
                <div className="p-2 space-y-1 max-h-[180px] overflow-hidden">
                  {displayedSnippets.map((s, idx) => (
                    <div
                      key={s.trigger}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        (step >= 4 && idx === 0) ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                          (step >= 4 && idx === 0) ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
                        }`}>
                          {s.trigger}
                        </span>
                        {s.tags.map(t => (
                          <span key={t} className={`text-[10px] px-1.5 py-0.2 rounded border ${
                            (step >= 4 && idx === 0) ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500 bg-white'
                          }`}>
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span className={`truncate max-w-[160px] text-right ${
                        (step >= 4 && idx === 0) ? 'text-gray-300' : 'text-gray-400'
                      }`}>
                        {s.content}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Palette Footer */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Fillin Palette</span>
                  <div className="flex items-center space-x-2">
                    <span><kbd className="font-mono bg-white border border-gray-200 px-1 rounded">↑↓</kbd> navigate</span>
                    <span><kbd className="font-mono bg-white border border-gray-200 px-1 rounded">↵</kbd> insert</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom helper state bar */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${step === 5 ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
              <span className="font-medium">
                {step === 0 && '1. User typing in document...'}
                {step === 1 && '2. Pressing shortcut ⌘ + Shift + K...'}
                {step === 2 && '3. Spotlight overlay opens...'}
                {step === 3 && '4. Fuzzy searching snippets...'}
                {step === 4 && '5. Selected /meeting with Enter...'}
                {step === 5 && '6. Expanded inline instantly!'}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === i ? 'w-5 bg-gray-900' : 'bg-gray-200'
                  }`}
                  aria-label={`Jump to animation step ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
