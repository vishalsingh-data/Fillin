import React, { useState } from 'react';
import { Zap, Lock, Tag, Keyboard, Download, Check, Sparkles } from 'lucide-react';

export const Features = () => {
  const [activeTag, setActiveTag] = useState('#work');
  const [keystrokes] = useState(14820);

  const tags = ['#work', '#email', '#dev', '#support'];

  const tagSnippets: Record<string, string> = {
    '#work': '/meeting → Let\'s hop on a quick call',
    '#email': '/followup → Following up on our previous note',
    '#dev': '/pr → LGTM! Merged to main branch',
    '#support': '/refund → Your refund has been processed',
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl mb-4">
          Developer-grade speed. Real superpowers.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Built local-first for uncompromising privacy, with modern tools to keep you in flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(270px,auto)]">
        
        {/* Card 1: Blazing Fast + Keystrokes Gamification (Spans 2 columns) */}
        <div className="group md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:bg-gray-100/80 transition-colors overflow-hidden relative flex flex-col justify-between">
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Zap className="w-7 h-7 text-gray-900" />
            </div>

            {/* Live Gamification Widget Preview */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-3 sm:p-4 shadow-sm inline-flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gray-900 font-mono tracking-tight">
                  {keystrokes.toLocaleString()} keystrokes saved
                </div>
                <div className="text-xs text-gray-500 font-medium">~1.2 hours of typing saved</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Expansion & Keystrokes Saved</h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
              Zero lag. Snippets expand in under 5 milliseconds with native DOM replacement. 
              Track your cumulative hours and keystrokes saved right in your popup—stored purely on your machine.
            </p>
          </div>
        </div>

        {/* Card 2: Local First & 1-Click JSON Portability (Spans 1 column, dark theme) */}
        <div className="group md:col-span-1 bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:bg-black transition-colors overflow-hidden relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Lock className="w-7 h-7 text-white" />
              </div>
              
              <span className="text-xs font-mono font-semibold bg-gray-800 text-emerald-400 border border-emerald-900/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> 100% Offline
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">Local-First & JSON Portability</h3>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              Your snippets never leave your browser. Zero cloud sync, no tracking, and 1-click JSON backup & restore so you always own your data.
            </p>
          </div>

          {/* Backup Badge */}
          <div className="bg-gray-800/80 border border-gray-700/80 rounded-xl p-3 flex items-center justify-between text-xs text-gray-300">
            <span className="font-mono">fillin-backup.json</span>
            <div className="flex items-center gap-1 text-gray-400 font-medium">
              <Download className="w-3.5 h-3.5" /> Export / Import
            </div>
          </div>
        </div>

        {/* Card 3: Smart Organization (#Tags) (Spans 1 column) */}
        <div className="group md:col-span-1 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Tag className="w-7 h-7 text-gray-900" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Organize with #Tags</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Tag your snippets and filter your collection in one click. No clunky folder hierarchies.
            </p>
          </div>

          {/* Interactive Tag Pills Mini-Widget */}
          <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTag === t
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-mono text-gray-500 bg-white p-2 rounded-lg border border-gray-100 truncate">
              {tagSnippets[activeTag]}
            </div>
          </div>
        </div>

        {/* Card 4: Works Everywhere (Spans 2 columns) */}
        <div className="group md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:bg-gray-100/80 transition-colors overflow-hidden relative flex flex-col justify-between">
          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Keyboard className="w-7 h-7 text-gray-900" />
            </div>

            {/* App support badges */}
            <div className="flex items-center flex-wrap gap-1.5">
              {['Notion', 'Gmail', 'Google Docs', 'Slack', 'Textareas'].map((app) => (
                <span
                  key={app}
                  className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 shadow-sm"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Universal DOM Compatibility</h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
              Engineered with specialized adapters for standard inputs, React synthetic event wrappers, and complex contenteditable rich-text editors. Expands cleanly without breaking undo history.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
