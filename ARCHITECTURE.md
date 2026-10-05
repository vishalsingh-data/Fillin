# Architecture

Fillin is built on a strict, decoupled monorepo architecture enforcing extreme separation of concerns. The primary directive is that the Chrome Extension, Landing Page, and Backend must be able to deploy and run entirely independently.

## Local-First Philosophy
The extension is entirely local-first. It relies on standard browser APIs (e.g. `chrome.storage.local`) for persistence and uses no external databases or synchronization tools. This ensures absolute privacy and immediate performance.

## The `@fillin/shared` Constraints
The `packages/shared` workspace is the heart of our business logic. To ensure absolute portability, it strictly adheres to the following rules:
- **No Chrome APIs**: It must run natively in Node.js, JS DOM, or a Service Worker.
- **No DOM APIs**: It cannot reference `window`, `document`, or `HTMLElement`. All DOM manipulation is explicitly handled by the consumer applications.
- **No React**: It contains zero UI code.
- **No Server Code**: It does not contain Fastify instances, routing, or secrets.

## Independent Backend
The `landing/backend` is entirely decoupled from the extension. It solely exists to power the waitlist form on the landing page. The extension does not perform network calls to this backend, ensuring that an API outage will never degrade the user's text expansion experience.

## Known Limitations
- `<input type="password">`: Text expansion is deliberately disabled in password fields for security.
- `<input type="email">`, `type="number"`: Standard HTML5 forbids reading the cursor position (`selectionStart`). Fillin implements a robust, instantaneous workaround by temporarily switching these to `type="text"` internally, but highly customized shadow-DOM implementations of these inputs might still resist expansion on rare edge cases.
- **Mobile Devices**: Chrome extensions are fundamentally unsupported on mobile Chrome browsers, meaning this tool is desktop-only.

## Extension DOM Adapters
To support arbitrary websites, Fillin utilizes an `AdapterFactory` pattern that generates a unified interface over disparate input types:
1. `TextInputAdapter`: For standard `<input>` and `<textarea>` elements.
2. `ContentEditableAdapter`: For complex rich-text editors (Notion, Gmail) using `isContentEditable`.
