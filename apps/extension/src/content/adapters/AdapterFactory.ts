import { InputAdapter } from './InputAdapter';
import { TextInputAdapter } from './TextInputAdapter';
import { ContentEditableAdapter } from './ContentEditableAdapter';

export class AdapterFactory {
  static getAdapter(element: Element | null): InputAdapter | null {
    if (!element) return null;

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return new TextInputAdapter(element);
    }

    if (element instanceof HTMLElement && (element.isContentEditable || element.getAttribute('contenteditable') === 'true')) {
      return new ContentEditableAdapter(element);
    }

    return null;
  }
}
