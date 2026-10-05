import React, { useState, useEffect } from 'react';

export const ProductDemo = () => {
  const [typed, setTyped] = useState('');
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    
    const animate = async () => {
      setTyped('');
      setExpanded(false);
      
      const trigger = '/email';
      for (let i = 0; i <= trigger.length; i++) {
        await new Promise(r => setTimeout(r, 150));
        setTyped(trigger.slice(0, i));
      }
      
      await new Promise(r => setTimeout(r, 500));
      setExpanded(true);
      
      await new Promise(r => setTimeout(r, 3000));
      animate();
    };
    
    animate();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">See it in action</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 max-w-2xl mx-auto text-left relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center font-mono text-lg min-h-[64px]">
              {!expanded ? (
                <>
                  <span className="text-purple-600 font-semibold">{typed}</span>
                  <span className="animate-pulse ml-[1px] w-0.5 h-5 bg-black block"></span>
                </>
              ) : (
                <>
                  <span className="text-gray-900">your.name@example.com</span>
                  <span className="animate-pulse ml-[1px] w-0.5 h-5 bg-black block"></span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4 pt-4 text-sm text-gray-500 font-medium">
              <div className="flex items-center">
                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded shadow-sm text-xs font-mono mr-2">/email</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded shadow-sm text-xs font-mono mx-2">Tab</kbd>
              </div>
              <span className="text-gray-300">→</span>
              <span className="text-gray-900">your.name@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
