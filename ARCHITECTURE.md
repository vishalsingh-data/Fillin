# Architecture

## Core Philosophy
- Simple, Fast, Lightweight, Local-first, Privacy-focused, Reliable.
- Core interaction: Create once. Type shortcut. Press Ctrl+Space. Done.
- Minimal MVP scope: Create, edit, delete, search, store locally, expand on Ctrl+Space.

## Monorepo Layout
- **Extension** (`apps/extension`): Chrome specific runtime, popup, content scripts, background. Local storage.
- **Landing Frontend** (`apps/landing/frontend`): Web UI for product marketing. No Chrome APIs.
- **Landing Backend** (`apps/landing/backend`): Independent Node server. Minimal API. Extension does not depend on it.
- **Shared Package** (`packages/shared`): Truly framework-agnostic code (types, constants).

## Adapter Pattern
- Input mechanisms on web pages (Input, Textarea, Contenteditable) must be isolated via InputAdapters.
- The trigger detection logic should not be tightly coupled to DOM implementations.

## Storage
- Extension React UI should not directly manipulate `chrome.storage.local`.
- Use a Repository pattern: `Service -> Repository -> Chrome Storage`.
