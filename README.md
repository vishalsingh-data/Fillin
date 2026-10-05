# Fillin

**Fill in your own blanks.**

Fillin is a Chrome text expander / personal text shortcut tool. It allows users to create their own custom text snippets and trigger them by typing a shortcut followed by `Tab` anywhere on a supported webpage.

## Project Structure

This is a pnpm + Turborepo monorepo.

- `apps/extension` - The Chrome Extension
- `apps/landing/frontend` - The landing page web app
- `apps/landing/backend` - The independent backend server
- `packages/shared` - Shared types, models, validation (framework-agnostic)
- `packages/config` - Shared ESLint, Prettier, TS configs

## Development

Run `pnpm install` at the root.
Run `pnpm run dev` to start all development servers.
Run `pnpm run build` to build all projects.

See `ARCHITECTURE.md` and `AGENTS.md` for strict architectural guidelines.
