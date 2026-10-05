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
    
    // Bypass React's value setter override to ensure 'input' events trigger state updates
    const prototype = Object.getPrototypeOf(this.element);
    let NativeSetter = null;
    
    // In some environments, the prototype might directly be HTMLInputElement, or we need to grab it from the window
    if (this.element instanceof HTMLTextAreaElement) {
      NativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    } else {
      NativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    }

    if (NativeSetter) {
      NativeSetter.call(this.element, result.text);
    } else {
      this.element.value = result.text;
    }
    
    this.element.selectionStart = result.cursorPosition;
    this.element.selectionEnd = result.cursorPosition;
    
    this.element.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
