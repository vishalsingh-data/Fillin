# Fillin AI Agents Rules

These rules govern all AI interaction and code generation for this project.

## Architectural Constraints
- Extension must remain independent from landing frontend.
- Extension must remain independent from landing backend.
- Landing frontend must remain independent from Chrome APIs.
- Backend must remain independently deployable.
- Shared package must remain framework-agnostic.
- No Chrome APIs inside shared.
- No DOM APIs inside shared.
- No React components inside shared.
- No server code inside shared.

## Development Rules
- Do NOT build future features (no AI, no cloud sync, no accounts) unless explicitly requested.
- Prioritize reliability over features.
- Never hardcode secrets.
- Always use specific tools (like write_to_file) instead of generic bash commands for file operations.
- Follow the phase discipline strictly. Stop and wait for the next phase instructions.
