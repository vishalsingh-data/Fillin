import { describe, it, expect, beforeEach } from 'vitest';
import { TextInputAdapter } from './TextInputAdapter';
import { ContentEditableAdapter } from './ContentEditableAdapter';
import { AdapterFactory } from './AdapterFactory';

describe('Input Adapters', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('TextInputAdapter', () => {
    let input: HTMLInputElement;
    let adapter: TextInputAdapter;

    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      document.body.appendChild(input);
      adapter = new TextInputAdapter(input);
    });

    it('reads text and cursor position correctly', () => {
      input.value = 'hello world';
      input.selectionStart = 5;
      
      expect(adapter.getText()).toBe('hello world');
      expect(adapter.getCursorPosition()).toBe(5);
    });

    it('replaces text correctly and updates cursor', () => {
      input.value = 'hello /trigger world';
      input.selectionStart = 14;
      
      // replace '/trigger' with 'replaced'
      adapter.replaceText(6, 14, 'replaced');
      
      expect(input.value).toBe('hello replaced world');
      expect(input.selectionStart).toBe(14); // 6 + 8
    });
  });

  describe('ContentEditableAdapter', () => {
    let div: HTMLDivElement;
    let adapter: ContentEditableAdapter;

    beforeEach(() => {
      div = document.createElement('div');
      div.contentEditable = 'true';
      document.body.appendChild(div);
      adapter = new ContentEditableAdapter(div);
      
      // JSDOM has limited Selection support, but we can set it up
      const textNode = document.createTextNode('hello /trigger world');
      div.appendChild(textNode);
      
      const range = document.createRange();
      range.setStart(textNode, 14);
      range.collapse(true);
      
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    });

    it('reads text and cursor position correctly', () => {
      expect(adapter.getText()).toBe('hello /trigger world');
      expect(adapter.getCursorPosition()).toBe(14);
    });

    it('replaces text correctly and updates cursor', () => {
      adapter.replaceText(6, 14, 'replaced');
      
      expect(div.textContent).toBe('hello replaced world');
      
      const selection = window.getSelection();
      expect(selection?.anchorOffset).toBe(14); // 6 + 8
    });
  });

  describe('AdapterFactory', () => {
    it('returns TextInputAdapter for input elements', () => {
      const input = document.createElement('input');
      const textarea = document.createElement('textarea');
      
      expect(AdapterFactory.getAdapter(input)).toBeInstanceOf(TextInputAdapter);
      expect(AdapterFactory.getAdapter(textarea)).toBeInstanceOf(TextInputAdapter);
    });

    it('returns ContentEditableAdapter for contenteditable elements', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.setAttribute('contenteditable', 'true');
      div.contentEditable = 'true';
      
      expect(AdapterFactory.getAdapter(div)).toBeInstanceOf(ContentEditableAdapter);
    });

    it('returns null for standard elements', () => {
      const div = document.createElement('div');
      expect(AdapterFactory.getAdapter(div)).toBeNull();
      expect(AdapterFactory.getAdapter(null)).toBeNull();
    });
  });
});
