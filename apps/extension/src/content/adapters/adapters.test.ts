import { describe, it, expect, beforeEach } from 'vitest';
import { TextInputAdapter } from './TextInputAdapter';
import { ContentEditableAdapter } from './ContentEditableAdapter';
import { AdapterFactory } from './AdapterFactory';

import { GoogleDocsAdapter } from './GoogleDocsAdapter';

describe('Input Adapters', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('GoogleDocsAdapter', () => {
    let adapter: GoogleDocsAdapter;

    beforeEach(() => {
      adapter = GoogleDocsAdapter.getInstance();
      adapter.resetBuffer();
    });

    it('records keys and manages rolling buffer', () => {
      adapter.recordKey('/');
      adapter.recordKey('e');
      adapter.recordKey('m');
      adapter.recordKey('a');
      adapter.recordKey('i');
      adapter.recordKey('l');

      expect(adapter.getText()).toBe('/email');
      expect(adapter.getCursorPosition()).toBe(6);

      adapter.recordKey('Backspace');
      expect(adapter.getText()).toBe('/emai');
    });

    it('resets buffer cleanly', () => {
      adapter.recordKey('/');
      adapter.recordKey('s');
      adapter.resetBuffer();

      expect(adapter.getText()).toBe('');
      expect(adapter.getCursorPosition()).toBe(0);
    });

    it('executes delete commands and inserts replacement text', () => {
      const deleteCommands: string[] = [];
      let insertedText = '';

      // Mock execCommand
      document.execCommand = (commandId: string, _showUI?: boolean, value?: string) => {
        if (commandId === 'delete') {
          deleteCommands.push('delete');
          return true;
        }
        if (commandId === 'insertText') {
          insertedText = value || '';
          return true;
        }
        return false;
      };

      adapter.recordKey('/');
      adapter.recordKey('e');
      adapter.recordKey('m');
      adapter.recordKey('a');
      adapter.recordKey('i');
      adapter.recordKey('l');

      adapter.replaceText(0, 6, 'test@example.com');

      expect(deleteCommands.length).toBe(6);
      expect(insertedText).toBe('test@example.com');
      expect(adapter.getText()).toBe('');
    });
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

    it('dispatches composed input and change events to cross shadow DOM boundaries', () => {
      let inputEventReceived: Event | null = null;
      let changeEventReceived: Event | null = null;

      input.addEventListener('input', (e) => {
        inputEventReceived = e;
      });
      input.addEventListener('change', (e) => {
        changeEventReceived = e;
      });

      adapter.replaceText(0, 0, 'new test');

      expect(inputEventReceived).not.toBeNull();
      expect((inputEventReceived as unknown as Event).bubbles).toBe(true);
      expect((inputEventReceived as unknown as Event).composed).toBe(true);

      expect(changeEventReceived).not.toBeNull();
      expect((changeEventReceived as unknown as Event).bubbles).toBe(true);
      expect((changeEventReceived as unknown as Event).composed).toBe(true);
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

    it('returns GoogleDocsAdapter when on Google Docs canvas', () => {
      const origLocation = window.location;
      delete (window as any).location;
      window.location = {
        hostname: 'docs.google.com',
        pathname: '/document/d/12345/edit',
      } as any;

      const docsCanvas = document.createElement('div');
      docsCanvas.className = 'kix-appview-editor';
      document.body.appendChild(docsCanvas);

      expect(AdapterFactory.getAdapter(docsCanvas)).toBeInstanceOf(GoogleDocsAdapter);

      window.location = origLocation;
    });

    it('returns TextInputAdapter when on Google Docs title input', () => {
      const origLocation = window.location;
      delete (window as any).location;
      window.location = {
        hostname: 'docs.google.com',
        pathname: '/document/d/12345/edit',
      } as any;

      const titleInput = document.createElement('input');
      titleInput.className = 'docs-title-input';
      titleInput.type = 'text';
      document.body.appendChild(titleInput);

      expect(AdapterFactory.getAdapter(titleInput)).toBeInstanceOf(TextInputAdapter);

      window.location = origLocation;
    });
  });
});
