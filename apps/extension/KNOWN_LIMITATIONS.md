# Fillin Known Limitations and Browser Behaviors

During the development of the Fillin Chrome extension, we prioritized clean architecture and local-first reliability. As a result, there are a few intentional limitations designed to keep the core replacement engine lightweight and maintainable.

## 1. Rich Text / ContentEditable Edge Cases

Fillin supports standard `contenteditable` fields out-of-the-box (like simple `<div>` blocks or plain text `<span>` nodes). However, if a snippet trigger spans across multiple deeply nested rich text nodes (e.g., you type `/` in one bold `<b>` tag and `email` in the adjacent plain text tag), the detector may fail to detect the trigger.

**Reason**: Fillin intentionally looks only at the text within the *currently focused text node*. We avoided complex DOM traversal algorithms that scan backwards across DOM boundaries on every single keystroke, as this can degrade typing performance on complex pages. 

## 2. React-Controlled Inputs

React 16+ aggressively overrides the native `HTMLInputElement.value` setter, causing standard programmatic `input.value = "text"` assignments to bypass React's internal state mechanism. 

**Workaround Applied**: We implemented a clean workaround inside `TextInputAdapter` that accesses the native prototype setter (`window.HTMLInputElement.prototype.value.set.call(...)`) and subsequently dispatches a synthetic `input` event. This successfully tricks React into registering the input.

## 3. Shadow DOM

Many modern web components encapsulate their inputs inside a Shadow DOM, shielding them from `document.activeElement` checks.

**Workaround Applied**: We implemented a recursive function `getDeepActiveElement()` in the content script that pierces open Shadow DOM boundaries by checking `element.shadowRoot` to find the true focused input element.

## 4. Asynchronous Storage Syncing

The background snippets are synced to the content script using `chrome.storage.onChanged`. If a user creates a new snippet in the popup, there is a theoretical delay (usually < 10ms) before the content script receives the update. The content script deliberately maintains a local cache so that it does not need to pause and `await` a storage call during every single `Tab` keydown event, prioritizing fluid typing over instantaneous syncing.
