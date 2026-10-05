# Architecture Docs

Please see the root [`ARCHITECTURE.md`](../../ARCHITECTURE.md) for the central architectural decisions, constraints, and philosophy guiding the Fillin repository.

## Components Breakdown
- `@fillin/extension`: Contains the DOM Adapters (Text, ContentEditable) and the Chrome Storage Repository.
- `@fillin/landing-frontend`: The visual marketing site and API client.
- `@fillin/landing-backend`: The isolated Fastify HTTP API for waitlists.
- `@fillin/shared`: The pure, framework-agnostic text detection engine.
