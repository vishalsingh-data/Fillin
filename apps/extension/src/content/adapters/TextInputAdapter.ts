import { InputAdapter } from './InputAdapter';
import { replaceTrigger } from '@fillin/shared';

export class TextInputAdapter implements InputAdapter {
  constructor(private element: HTMLInputElement | HTMLTextAreaElement) {}

  getText(): string {
    return this.element.value;
  }

  getCursorPosition(): number | null {
    return this.element.selectionStart;
  }

  replaceText(start: number, end: number, newContent: string): void {
    const originalText = this.getText();
    const result = replaceTrigger(originalText, { trigger: '', start, end }, newContent);
    
    this.element.value = result.text;
    this.element.selectionStart = result.cursorPosition;
    this.element.selectionEnd = result.cursorPosition;
    
    this.element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
