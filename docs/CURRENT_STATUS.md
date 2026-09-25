# Current Status

## Current Phase

**Phase 0 — Foundation**

## Current Milestone

Implementation architecture and open-source integration strategy.

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
- Concrete implementation architecture defined.
- Open-source component registry created.
- Open-source integration strategy defined.

## Selected Stack

Next.js + TypeScript + Tailwind CSS → FastAPI/Python → PostgreSQL → Supabase Auth/Storage adapters → Git-based Markdown/MDX content → provider-neutral LLM layer → isolated execution workers → Vitest/Playwright/pytest → Vercel + container deployment.

## Open-Source Strategy

Use multiple open-source projects through reference patterns, compatible dependencies, and isolated adapters where appropriate. Direct code reuse is currently limited to components with verified compatible licensing. MIT candidates currently prioritized include Cairn, AI Deep Dive, and vibe-learn. GPL/AGPL projects such as Adapt and LearnHouse remain reference-only unless a deliberate license strategy is approved.

## In Progress

Prepare the initial repository implementation skeleton and freeze the first vertical slice.

## Next Task

Create the implementation skeleton and contracts for the first vertical slice: request → skill resolution → lesson → exercise → attempt → progress.

## Do Not Work On Yet

- Do not build all 50+ skill libraries.
- Do not build advanced AI agents.
- Do not optimize deployment infrastructure.
- Do not add unnecessary integrations.
- Do not begin large-scale UI implementation before the first vertical slice is working.
- Do not introduce microservices without a measured requirement.
- Do not expose untrusted Python/SQL execution publicly before sandbox security controls are implemented and tested.

## Working Rule

Only the current milestone should drive implementation. New ideas belong in `docs/FUTURE.md` until they are intentionally promoted into the roadmap.
