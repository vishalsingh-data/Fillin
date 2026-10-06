import { detectTrigger } from '@fillin/shared';
import { AdapterFactory } from './adapters/AdapterFactory';

let snippetsCache: Record<string, { content: string; isHtml: boolean }> = {};
let triggersCache: string[] = [];

export function updateCache(snippets: { trigger: string, content: string, isHtml?: boolean }[]) {
  snippetsCache = {};
  triggersCache = [];
  for (const s of snippets) {
    snippetsCache[s.trigger] = { content: s.content, isHtml: !!s.isHtml };
    triggersCache.push(s.trigger);
  }
}

export function getDeepActiveElement(root: Document | ShadowRoot = document): Element | null {
  const activeEl = root.activeElement;
  if (!activeEl) return null;
  if (activeEl.shadowRoot) {
    return getDeepActiveElement(activeEl.shadowRoot);
  }
  return activeEl;
}

export function handleKeyDown(e: KeyboardEvent) {
  if (!(e.ctrlKey && e.code === 'Space')) return;

  const activeEl = getDeepActiveElement();
  const adapter = AdapterFactory.getAdapter(activeEl);
  
  if (adapter) {
    const text = adapter.getText();
    const cursor = adapter.getCursorPosition();

    if (cursor === null) return;

    const detection = detectTrigger(text, cursor, triggersCache);
    if (detection) {
      const snippet = snippetsCache[detection.trigger];
      if (snippet !== undefined) {
        e.preventDefault();
        adapter.replaceText(detection.start, detection.end, snippet.content, snippet.isHtml);
      }
    }
  }
}

// Initialize only in actual browser environment
if (typeof document !== 'undefined') {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get('fillin_snippets', (result) => {
      const snippets = result['fillin_snippets'] || [];
      updateCache(snippets);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes['fillin_snippets']) {
        updateCache(changes['fillin_snippets'].newValue || []);
      }
    });
  } else {
    try {
      const data = localStorage.getItem('fillin_snippets');
      if (data) {
        updateCache(JSON.parse(data));
      }
    } catch (e) {
      console.error(e);
    }
  }

  document.addEventListener('keydown', handleKeyDown);
}
