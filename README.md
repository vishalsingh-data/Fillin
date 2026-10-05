# Fillin

**Fill in your own blanks.**
Create shortcuts for anything you type repeatedly.

Fillin is a blazing-fast, privacy-first Chrome Extension that expands custom text snippets natively in your browser using the `Ctrl + Space` hotkey. It runs entirely on your local machine, requiring no accounts, no cloud sync, and absolutely no external dependencies to function.

## MVP Functionality
- **Trigger Detection**: Type a snippet (e.g. `/email`), hit `Ctrl + Space`, and Fillin will instantly expand it.
- **Universal Adapters**: Works seamlessly in standard text inputs, textareas, React-controlled fields, and complex `contenteditable` wrappers (like Notion or Gmail).
- **Popup UI**: A sleek, minimal Chrome extension popup to create, edit, and delete your personal shortcuts.
- **Local Persistence**: All snippets are stored securely in Chrome's local storage.

## Privacy Model
Fillin operates under a strict **local-first privacy model**. 
- No typing data is ever sent to a server.
- The extension requires only the `"storage"` permission to save your snippets locally.
- It operates completely independently of the Fillin backend and landing page.

## Repository Structure
This is a standard Turborepo monorepo using `pnpm` workspaces.
- `apps/extension`: The core Chrome extension (React, Vite).
- `apps/landing/frontend`: The product landing page (React, Vite, Tailwind).
- `apps/landing/backend`: The independent waitlist API (Fastify, Zod).
- `packages/shared`: Pure, agnostic business logic and types shared across apps.

## Documentation
- [Development Setup & Guides](docs/development/README.md)
- [Architecture & Design Decisions](ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Product & Features](docs/product/README.md)
