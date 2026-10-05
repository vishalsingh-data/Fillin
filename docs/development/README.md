# Development Guide

This directory contains resources for building and testing Fillin locally.

## Chrome Extension Loading
To test the extension locally:
1. Build it first: `pnpm --filter @fillin/extension run build`.
2. Open Chrome -> `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select `apps/extension/dist`.
5. The extension is now loaded! You can open the popup and start creating snippets.

### Extension Development
The extension runs on Vite. However, due to Chrome Extension CSP and module loading, hot module replacement (HMR) for the content scripts requires special configuration or manual rebuilds. For the popup, `pnpm run dev` works natively.
The content script is explicitly bundled as an IIFE via `vite.content.config.ts`.

## Landing Page Development
The landing page (`apps/landing/frontend`) is a standard Vite + React + TailwindCSS application.
- Run `pnpm --filter @fillin/landing-frontend run dev`.
- Ensure you have a local `.env` with `VITE_API_URL` pointing to the backend (e.g. `http://localhost:3000`).

## Backend Development
The backend (`apps/landing/backend`) is a Node.js + Fastify API.
- Run `pnpm --filter @fillin/landing-backend run dev` (this starts the server with hot-reload).
- Provide a `.env` with `CORS_ORIGIN=http://localhost:5173` to accept requests from your local frontend.
- Provide `PORT=3000`.
