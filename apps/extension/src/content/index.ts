import { detectTrigger, Snippet } from '@fillin/shared';
import { AdapterFactory } from './adapters/AdapterFactory';
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
  if (activeEl.shadowRoot) {
    return getDeepActiveElement(activeEl.shadowRoot);
  }
  return activeEl;
}

export function handleKeyDown(e: KeyboardEvent) {
  // Shortcut 1: In-Page Command Palette (Ctrl+Shift+K or Cmd+Shift+K or Cmd+/)
  const isPaletteShortcut =
    ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 'k' || e.code === 'KeyK')) ||
    ((e.metaKey || e.ctrlKey) && e.key === '/' && !e.shiftKey && !e.altKey);

  if (isPaletteShortcut) {
    e.preventDefault();
    e.stopPropagation();
    commandPalette.open();
    return;
  }

  // Shortcut 2: Trigger expansion (Ctrl + Space)
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
        statsService.recordExpansion(detection.trigger.length, snippet.content.length);
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
