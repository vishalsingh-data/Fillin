import { detectTrigger, replaceTrigger } from '@fillin/shared';

let snippetsCache: Record<string, string> = {};
let triggersCache: string[] = [];

export function updateCache(snippets: { trigger: string, content: string }[]) {
  snippetsCache = {};
  triggersCache = [];
  for (const s of snippets) {
    snippetsCache[s.trigger] = s.content;
    triggersCache.push(s.trigger);
  }
}

export function handleKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Tab') return;

  const activeEl = document.activeElement;
  if (!activeEl) return;

  if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) {
    const text = activeEl.value;
    const cursor = activeEl.selectionStart;

    if (cursor === null) return;

    const detection = detectTrigger(text, cursor, triggersCache);
    if (detection) {
      const content = snippetsCache[detection.trigger];
      if (content !== undefined) {
        e.preventDefault();
        
        const result = replaceTrigger(text, detection, content);
        
        activeEl.value = result.text;
        activeEl.selectionStart = result.cursorPosition;
        activeEl.selectionEnd = result.cursorPosition;
        
        activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
}

// Initialize only in actual browser environment
if (typeof document !== 'undefined' && typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.local.get('fillin_snippets', (result) => {
    const snippets = result['fillin_snippets'] || [];
    updateCache(snippets);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes['fillin_snippets']) {
      updateCache(changes['fillin_snippets'].newValue || []);
    }
  });

  document.addEventListener('keydown', handleKeyDown);
}
