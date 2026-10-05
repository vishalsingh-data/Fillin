import { describe, it, expect, beforeEach } from 'vitest';
import { handleKeyDown, updateCache } from './index';

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

  const triggerTab = () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    handleKeyDown(event);
    return event;
  };

  it('intercepts Tab and replaces trigger at the beginning', () => {
    input.value = '/email';
    input.selectionStart = 6;
    input.selectionEnd = 6;

    const event = triggerTab();

    expect(event.defaultPrevented).toBe(true);
    expect(input.value).toBe('test@example.com');
    expect(input.selectionStart).toBe(16);
  });

  it('intercepts Tab and replaces trigger in the middle', () => {
    input.value = 'Hello /email world';
    input.selectionStart = 12; // immediately after /email
    input.selectionEnd = 12;

    const event = triggerTab();

    expect(event.defaultPrevented).toBe(true);
    expect(input.value).toBe('Hello test@example.com world');
    expect(input.selectionStart).toBe(22);
  });

  it('allows default Tab behavior when no trigger matches', () => {
    input.value = 'Hello email world';
    input.selectionStart = 11;
    input.selectionEnd = 11;

    const event = triggerTab();

    expect(event.defaultPrevented).toBe(false);
    expect(input.value).toBe('Hello email world');
  });

  it('allows default Tab behavior when trigger is not immediately before cursor', () => {
    input.value = '/email ';
    input.selectionStart = 7;
    input.selectionEnd = 7;

    const event = triggerTab();

    expect(event.defaultPrevented).toBe(false);
  });

  it('handles empty replacement content properly', () => {
    input.value = '/empty';
    input.selectionStart = 6;
    input.selectionEnd = 6;

    const event = triggerTab();

    expect(event.defaultPrevented).toBe(true);
    expect(input.value).toBe('');
    expect(input.selectionStart).toBe(0);
  });

  it('ignores invalid triggers', () => {
    input.value = '/unknown';
    input.selectionStart = 8;
    input.selectionEnd = 8;

    const event = triggerTab();

    expect(event.defaultPrevented).toBe(false);
    expect(input.value).toBe('/unknown');
  });

  it('handles multiple identical triggers correctly (replaces the one before cursor)', () => {
    input.value = '/email /email';
    input.selectionStart = 13;
    input.selectionEnd = 13;

    const event = triggerTab();

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
});
