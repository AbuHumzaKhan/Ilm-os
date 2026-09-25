# Current Status

## Current Phase

**Phase 0 — Foundation**

## Current Milestone

Technology stack selection.

## Completed

- Public GitHub repository created.
- MIT license present.
- README created.
- Project Mind documented.
- Controlled development plan documented.
- Roadmap documented.
- Future-scope boundary documented.
- Development rules documented.
- Initial architecture boundaries documented.
- Initial decision log created.
- Initial 50+ skill catalog created.
- Contribution guidelines created.
- Security policy created.
- Base `.gitignore` created.
- Formal Learning Engine domain model documented.
- Draft Learning Engine schema created.
- Domain model validated against Excel/VLOOKUP, SQL/JOIN, and Python/Pandas scenarios.
- Technical architecture layer defined.
- Technical requirements and technology-selection criteria defined.
- Multi-page Learning UX specification defined.
- Initial technology stack selected and documented.

## Selected Stack

Next.js + TypeScript + Tailwind CSS → FastAPI/Python → PostgreSQL → Supabase Auth/Storage adapters → Git-based Markdown/MDX content → provider-neutral LLM layer → isolated execution workers → Vitest/Playwright/pytest → Vercel + container deployment.

## In Progress

Create the implementation architecture and repository structure from the accepted technology stack.

## Next Task

Define the concrete `src/` architecture, application modules, API boundaries, content directories, database/migration structure, execution-worker boundaries, and development workflow.

## Do Not Work On Yet

- Do not build all 50+ skill libraries.
- Do not build advanced AI agents.
- Do not optimize deployment infrastructure.
- Do not add unnecessary integrations.
- Do not start large-scale UI implementation before the implementation architecture is established.
- Do not introduce microservices without a measured requirement.
- Do not expose untrusted Python/SQL execution publicly before sandbox security controls are implemented and tested.

## Working Rule

Only the current milestone should drive implementation. New ideas belong in `docs/FUTURE.md` until they are intentionally promoted into the roadmap.
