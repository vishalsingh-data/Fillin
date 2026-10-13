import { describe, it, expect, beforeEach } from 'vitest';
import { handleKeyDown, updateCache, getDeepActiveElement, getTargetElement } from './index';

describe('Content Script Replacer', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);
    input.focus();

    updateCache([
      { trigger: '/email', content: 'test@example.com' },
      { trigger: '/sig', content: 'Thanks,\nJohn' },
      { trigger: '/empty', content: '' }
    ]);
  });

  const triggerExpansion = () => {
    const event = new KeyboardEvent('keydown', { key: ' ', code: 'Space', ctrlKey: true, cancelable: true });
    handleKeyDown(event);
    return event;
  };

  it('intercepts Ctrl+Space and replaces trigger at the beginning', () => {
    input.value = '/email';
    input.selectionStart = 6;
    input.selectionEnd = 6;

    const event = triggerExpansion();

    expect(event.defaultPrevented).toBe(true);
    expect(input.value).toBe('test@example.com');
    expect(input.selectionStart).toBe(16);
  });

  it('intercepts Ctrl+Space and replaces trigger in the middle', () => {
    input.value = 'Hello /email world';
    input.selectionStart = 12; // immediately after /email
    input.selectionEnd = 12;

    const event = triggerExpansion();

    expect(event.defaultPrevented).toBe(true);
    expect(input.value).toBe('Hello test@example.com world');
    expect(input.selectionStart).toBe(22);
  });

  it('allows default Ctrl+Space behavior when no trigger matches', () => {
    input.value = 'Hello email world';
    input.selectionStart = 11;
    input.selectionEnd = 11;

    const event = triggerExpansion();

    expect(event.defaultPrevented).toBe(false);
    expect(input.value).toBe('Hello email world');
  });

  it('allows default Ctrl+Space behavior when trigger is not immediately before cursor', () => {
    input.value = '/email ';
    input.selectionStart = 7;
    input.selectionEnd = 7;

    const event = triggerExpansion();

    expect(event.defaultPrevented).toBe(false);
  });

  it('handles empty replacement content properly', () => {
    input.value = '/empty';
    input.selectionStart = 6;
    input.selectionEnd = 6;

    const event = triggerExpansion();

    expect(event.defaultPrevented).toBe(true);
    expect(input.value).toBe('');
    expect(input.selectionStart).toBe(0);
  });

  it('ignores invalid triggers', () => {
    input.value = '/unknown';
    input.selectionStart = 8;
    input.selectionEnd = 8;

    const event = triggerExpansion();

    expect(event.defaultPrevented).toBe(false);
    expect(input.value).toBe('/unknown');
  });

  it('handles multiple identical triggers correctly (replaces the one before cursor)', () => {
    input.value = '/email /email';
    input.selectionStart = 13;
    input.selectionEnd = 13;

    const event = triggerExpansion();

    expect(event.defaultPrevented).toBe(true);
    expect(input.value).toBe('/email test@example.com');
  });

  it('ignores other keys', () => {
    input.value = '/email';
    input.selectionStart = 6;
    input.selectionEnd = 6;

    const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    handleKeyDown(event);

    expect(event.defaultPrevented).toBe(false);
    expect(input.value).toBe('/email');
  });

  describe('Shadow DOM & Web Components Support (e.g. YouTube Search Bar)', () => {
    it('pierces shadow DOM to find the active element', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      
      const shadowRoot = host.attachShadow({ mode: 'open' });
      const shadowInput = document.createElement('input');
      shadowInput.type = 'text';
      shadowRoot.appendChild(shadowInput);
      
      shadowInput.focus();
      
      expect(getDeepActiveElement()).toBe(shadowInput);
    });

    it('falls back to host element if shadow root has no activeElement', () => {
      const host = document.createElement('button');
      document.body.appendChild(host);
      host.attachShadow({ mode: 'open' });
      host.focus();

      expect(getDeepActiveElement()).toBe(host);
    });

    it('resolves target element from composedPath', () => {
      const host = document.createElement('div');
      const shadowRoot = host.attachShadow({ mode: 'open' });
      const shadowInput = document.createElement('input');
      shadowRoot.appendChild(shadowInput);

      const fakeEvent = {
        composedPath: () => [shadowInput, shadowRoot, host, document.body, document, window],
      } as unknown as KeyboardEvent;

      expect(getTargetElement(fakeEvent)).toBe(shadowInput);
    });

    it('successfully expands snippet inside a custom Web Component search bar using composedPath', () => {
      const ytdSearchbox = document.createElement('div');
      document.body.appendChild(ytdSearchbox);
      const shadowRoot = ytdSearchbox.attachShadow({ mode: 'open' });
      const innerInput = document.createElement('input');
      innerInput.type = 'text';
      innerInput.value = '/email';
      innerInput.selectionStart = 6;
      innerInput.selectionEnd = 6;
      shadowRoot.appendChild(innerInput);

      // Simulate keyboard event with composedPath pointing to innerInput
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        ctrlKey: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'composedPath', {
        value: () => [innerInput, shadowRoot, ytdSearchbox, document.body, document, window],
      });

      handleKeyDown(event);

      expect(event.defaultPrevented).toBe(true);
      expect(innerInput.value).toBe('test@example.com');
      expect(innerInput.selectionStart).toBe(16);
    });
  });

  describe('Command Palette Shortcut', () => {
    it('opens command palette on Ctrl+Shift+K', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        ctrlKey: true,
        shiftKey: true,
        cancelable: true,
      });
      handleKeyDown(event);

      expect(event.defaultPrevented).toBe(true);
      const host = document.getElementById('fillin-command-palette-host');
      expect(host).not.toBeNull();
    });
  });
});
