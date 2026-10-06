import { InputAdapter } from './InputAdapter';
import { replaceTrigger } from '@fillin/shared';

export class ContentEditableAdapter implements InputAdapter {
  constructor(private element: HTMLElement) {}

  getText(): string {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return '';
    const node = selection.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    return '';
  }

  getCursorPosition(): number | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const node = selection.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) {
      return selection.anchorOffset;
    }
    return null;
  }

  replaceText(start: number, end: number, newContent: string, isHtml?: boolean): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const node = selection.anchorNode;
    
    if (node?.nodeType === Node.TEXT_NODE) {
      if (isHtml) {
        // We want to replace text from `start` to `end` within `node`.
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, end);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Use insertHTML to insert the rich text
        document.execCommand('insertHTML', false, newContent);
        
        this.element.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        const originalText = node.textContent || '';
        const result = replaceTrigger(originalText, { trigger: '', start, end }, newContent);
        
        node.textContent = result.text;
        
        const range = document.createRange();
        range.setStart(node, result.cursorPosition);
        range.setEnd(node, result.cursorPosition);
        
        selection.removeAllRanges();
        selection.addRange(range);
        
        this.element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
}
