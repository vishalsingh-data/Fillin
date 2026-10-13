import { InputAdapter } from './InputAdapter';
import { TextInputAdapter } from './TextInputAdapter';
import { ContentEditableAdapter } from './ContentEditableAdapter';
import { GoogleDocsAdapter } from './GoogleDocsAdapter';

export class AdapterFactory {
  static getAdapter(element: Element | null): InputAdapter | null {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (element instanceof HTMLInputElement && element.type === 'password') {
        return null;
      }
      return new TextInputAdapter(element);
    }

    if (
      element instanceof HTMLElement &&
      (element.isContentEditable || element.getAttribute('contenteditable') === 'true') &&
      !element.classList.contains('docs-texteventtarget-iframe') &&
      !element.closest?.('.docs-texteventtarget-iframe')
    ) {
      return new ContentEditableAdapter(element);
    }

    if (GoogleDocsAdapter.isDocsCanvas(element)) {
      return GoogleDocsAdapter.getInstance();
    }

    return null;
  }
}
