import { detectTrigger, Snippet } from '@fillin/shared';
import { AdapterFactory } from './adapters/AdapterFactory';
import { GoogleDocsAdapter } from './adapters/GoogleDocsAdapter';
import { statsService } from '../services/StatsService';
import { commandPalette } from './CommandPalette';

let snippetsCache: Record<string, { content: string; isHtml: boolean }> = {};
let triggersCache: string[] = [];
let fullSnippetsCache: Snippet[] = [];

export function updateCache(
  snippets: (Snippet | { trigger: string; content: string; isHtml?: boolean; tags?: string[] })[]
) {
  snippetsCache = {};
  triggersCache = [];
  fullSnippetsCache = (snippets || []).map((s, idx) => ({
    id: (s as Snippet).id || String(idx),
    trigger: s.trigger,
    content: s.content,
    isHtml: !!s.isHtml,
    tags: (s as Snippet).tags,
    createdAt: (s as Snippet).createdAt || Date.now(),
    updatedAt: (s as Snippet).updatedAt || Date.now(),
  }));

  for (const s of fullSnippetsCache) {
    snippetsCache[s.trigger] = { content: s.content, isHtml: !!s.isHtml };
    triggersCache.push(s.trigger);
  }

  commandPalette.updateSnippets(fullSnippetsCache);
}

export function getDeepActiveElement(root: Document | ShadowRoot = document): Element | null {
  const activeEl = root.activeElement;
  if (!activeEl) return null;
  if (activeEl.shadowRoot && activeEl.shadowRoot.activeElement) {
    return getDeepActiveElement(activeEl.shadowRoot);
  }
  return activeEl;
}

export function getTargetElement(e?: KeyboardEvent): Element | null {
  if (e && e.composedPath && typeof e.composedPath === 'function') {
    const path = e.composedPath();
    if (path.length > 0 && path[0] instanceof Element) {
      return path[0];
    }
  }
  const deep = getDeepActiveElement();
  if (deep) return deep;
  if (e && e.target instanceof Element) {
    return e.target;
  }
  return null;
}

export function handleKeyDown(e: KeyboardEvent) {
  const targetEl = getTargetElement(e);

  // Shortcut 1: In-Page Command Palette (Ctrl+Shift+K or Cmd+Shift+K or Cmd+/)
  const isPaletteShortcut =
    ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 'k' || e.code === 'KeyK')) ||
    ((e.metaKey || e.ctrlKey) && e.key === '/' && !e.shiftKey && !e.altKey);

  if (isPaletteShortcut) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.self !== window.top) {
      try {
        window.top?.postMessage({ type: 'FILLIN_OPEN_PALETTE' }, '*');
      } catch {
        commandPalette.open(targetEl);
      }
    } else {
      commandPalette.open(targetEl);
    }
    return;
  }

  // Google Docs buffer recording (for printable characters & Backspace)
  if (GoogleDocsAdapter.isGoogleDocs() && GoogleDocsAdapter.isDocsCanvas(targetEl)) {
    if (e.key === 'Backspace') {
      GoogleDocsAdapter.getInstance().recordKey('Backspace');
    } else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      GoogleDocsAdapter.getInstance().recordKey(e.key);
    }
  }

  // Shortcut 2: Trigger expansion (Ctrl + Space)
  if (!(e.ctrlKey && e.code === 'Space')) return;

  const adapter = AdapterFactory.getAdapter(targetEl);

  if (adapter) {
    const text = adapter.getText();
    const cursor = adapter.getCursorPosition();

    if (cursor === null) return;

    const detection = detectTrigger(text, cursor, triggersCache);
    if (detection) {
      const snippet = snippetsCache[detection.trigger];
      if (snippet !== undefined) {
        e.preventDefault();
        e.stopPropagation();
        adapter.replaceText(detection.start, detection.end, snippet.content, snippet.isHtml);
        statsService.recordExpansion(detection.trigger.length, snippet.content.length);
      }
    }
  }
}

export function initGoogleDocsObserver() {
  if (typeof document === 'undefined' || !GoogleDocsAdapter.isGoogleDocs()) return;

  const attachToIframe = () => {
    const iframe = document.querySelector('iframe.docs-texteventtarget-iframe') as HTMLIFrameElement | null;
    if (iframe && iframe.contentDocument) {
      try {
        iframe.contentDocument.removeEventListener('keydown', handleKeyDown, true);
        iframe.contentDocument.addEventListener('keydown', handleKeyDown, true);
      } catch {
        // Cross-origin fallback
      }
    }
  };

  attachToIframe();

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      attachToIframe();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
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

  document.addEventListener('keydown', handleKeyDown, true);
  initGoogleDocsObserver();

  if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'FILLIN_OPEN_PALETTE') {
        const activeTarget = getTargetElement() || document.activeElement;
        commandPalette.open(activeTarget);
      }
    });
  }
}
