import { Snippet } from '@fillin/shared';
import { AdapterFactory } from './adapters/AdapterFactory';
import { statsService } from '../services/StatsService';
import { getDeepActiveElement } from './index';

export class CommandPalette {
  private host: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private targetElement: Element | null = null;
  private targetSelection: { start: number; end: number } | null = null;
  private targetRange: Range | null = null;
  private snippets: Snippet[] = [];
  private filteredSnippets: Snippet[] = [];
  private selectedIndex: number = 0;

  constructor() {}

  public updateSnippets(snippets: Snippet[]) {
    this.snippets = snippets;
  }

  public isOpen(): boolean {
    return this.host !== null;
  }

  public open() {
    if (this.isOpen()) return;

    this.targetElement = getDeepActiveElement();

    // Preserve cursor position or text range
    if (this.targetElement instanceof HTMLInputElement || this.targetElement instanceof HTMLTextAreaElement) {
      try {
        this.targetSelection = {
          start: this.targetElement.selectionStart ?? this.targetElement.value.length,
          end: this.targetElement.selectionEnd ?? this.targetElement.value.length,
        };
      } catch {
        this.targetSelection = null;
      }
    } else {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        this.targetRange = sel.getRangeAt(0).cloneRange();
      } else {
        this.targetRange = null;
      }
    }

    this.filteredSnippets = [...this.snippets];
    this.selectedIndex = 0;

    this.render();
  }

  public close() {
    if (this.host && this.host.parentNode) {
      this.host.parentNode.removeChild(this.host);
    }
    this.host = null;
    this.shadow = null;

    // Restore focus to original element
    if (this.targetElement && this.targetElement instanceof HTMLElement) {
      try {
        this.targetElement.focus();
        if (
          this.targetSelection &&
          (this.targetElement instanceof HTMLInputElement || this.targetElement instanceof HTMLTextAreaElement)
        ) {
          this.targetElement.setSelectionRange(this.targetSelection.start, this.targetSelection.end);
        } else if (this.targetRange) {
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(this.targetRange);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  private insertSnippet(snippet: Snippet) {
    const el = this.targetElement;
    this.close();

    if (!el) return;

    // Focus element before insertion
    if (el instanceof HTMLElement) {
      el.focus();
    }

    const adapter = AdapterFactory.getAdapter(el);
    if (adapter) {
      let start = 0;
      let end = 0;

      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        start = this.targetSelection ? this.targetSelection.start : (adapter.getCursorPosition() ?? adapter.getText().length);
        end = this.targetSelection ? this.targetSelection.end : start;
      } else {
        start = adapter.getCursorPosition() ?? 0;
        end = start;
      }

      adapter.replaceText(start, end, snippet.content, snippet.isHtml);
      statsService.recordExpansion(0, snippet.content.length);
    }
  }

  private render() {
    this.host = document.createElement('div');
    this.host.id = 'fillin-command-palette-host';
    this.shadow = this.host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 15vh;
        z-index: 2147483647;
        animation: fadeIn 0.15s ease-out;
      }
      .modal {
        width: 480px;
        max-width: calc(100vw - 32px);
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideDown 0.15s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .header {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #f3f4f6;
        gap: 10px;
      }
      .search-icon {
        width: 16px;
        height: 16px;
        color: #9ca3af;
        flex-shrink: 0;
      }
      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #111827;
        background: transparent;
      }
      .search-input::placeholder {
        color: #9ca3af;
      }
      .list {
        max-height: 280px;
        overflow-y: auto;
        padding: 6px;
      }
      .list::-webkit-scrollbar {
        width: 6px;
      }
      .list::-webkit-scrollbar-thumb {
        background: #e5e7eb;
        border-radius: 3px;
      }
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        border-radius: 10px;
        cursor: pointer;
        transition: background 0.1s;
        gap: 12px;
      }
      .item:hover, .item.selected {
        background: #f3f4f6;
      }
      .item-left {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .trigger-badge {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 12px;
        font-weight: 600;
        background: #e5e7eb;
        color: #1f2937;
        padding: 2px 6px;
        border-radius: 6px;
        flex-shrink: 0;
      }
      .tag-badge {
        font-size: 10px;
        color: #6b7280;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        padding: 1px 5px;
        border-radius: 4px;
        flex-shrink: 0;
      }
      .preview {
        font-size: 13px;
        color: #4b5563;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .empty {
        padding: 32px 16px;
        text-align: center;
        color: #9ca3af;
        font-size: 13px;
      }
      .footer {
        padding: 8px 16px;
        background: #fafafa;
        border-top: 1px solid #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        color: #9ca3af;
      }
      .kbd {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        padding: 1px 4px;
        border-radius: 4px;
        color: #6b7280;
        margin: 0 2px;
      }
    `;
    this.shadow.appendChild(style);

    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    const modal = document.createElement('div');
    modal.className = 'modal';

    // Header
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    `;

    const input = document.createElement('input');
    input.className = 'search-input';
    input.placeholder = 'Search snippets or #tags...';
    input.autofocus = true;

    header.appendChild(input);
    modal.appendChild(header);

    // List
    const list = document.createElement('div');
    list.className = 'list';
    modal.appendChild(list);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = `
      <span>Fillin Palette</span>
      <span>
        <span class="kbd">↑↓</span> navigate
        <span class="kbd">↵</span> insert
        <span class="kbd">esc</span> close
      </span>
    `;
    modal.appendChild(footer);

    backdrop.appendChild(modal);
    this.shadow.appendChild(backdrop);
    document.body.appendChild(this.host);

    // Render list items
    const updateList = () => {
      list.innerHTML = '';
      if (this.filteredSnippets.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = this.snippets.length === 0 ? 'No snippets created yet.' : 'No matching snippets.';
        list.appendChild(empty);
        return;
      }

      this.filteredSnippets.forEach((s, idx) => {
        const item = document.createElement('div');
        item.className = `item ${idx === this.selectedIndex ? 'selected' : ''}`;
        item.addEventListener('click', () => this.insertSnippet(s));

        const left = document.createElement('div');
        left.className = 'item-left';

        const triggerBadge = document.createElement('span');
        triggerBadge.className = 'trigger-badge';
        triggerBadge.textContent = s.trigger;
        left.appendChild(triggerBadge);

        if (s.tags && s.tags.length > 0) {
          s.tags.slice(0, 2).forEach((t) => {
            const tagBadge = document.createElement('span');
            tagBadge.className = 'tag-badge';
            tagBadge.textContent = `#${t}`;
            left.appendChild(tagBadge);
          });
        }

        const preview = document.createElement('span');
        preview.className = 'preview';
        preview.textContent = s.content;

        item.appendChild(left);
        item.appendChild(preview);
        list.appendChild(item);
      });

      // Ensure selected item is visible
      const selectedEl = list.children[this.selectedIndex] as HTMLElement | undefined;
      if (selectedEl && selectedEl.scrollIntoView) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    };

    updateList();

    // Event listeners
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        this.filteredSnippets = [...this.snippets];
      } else {
        this.filteredSnippets = this.snippets.filter(
          (s) =>
            s.trigger.toLowerCase().includes(q) ||
            s.content.toLowerCase().includes(q) ||
            (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      this.selectedIndex = 0;
      updateList();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.filteredSnippets.length > 0) {
          this.selectedIndex = (this.selectedIndex + 1) % this.filteredSnippets.length;
          updateList();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.filteredSnippets.length > 0) {
          this.selectedIndex =
            (this.selectedIndex - 1 + this.filteredSnippets.length) % this.filteredSnippets.length;
          updateList();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.filteredSnippets.length > 0 && this.filteredSnippets[this.selectedIndex]) {
          this.insertSnippet(this.filteredSnippets[this.selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });

    // Ensure input gets focused
    setTimeout(() => {
      input.focus();
    }, 10);
  }
}

export const commandPalette = new CommandPalette();
