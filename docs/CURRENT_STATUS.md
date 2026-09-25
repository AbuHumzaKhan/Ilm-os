# Current Status

## Current Phase

**Phase 1 — Core Learning Engine**

## Current Milestone

**M2 — Persistent Learning State**

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
- First VLOOKUP vertical slice implemented and verified.
- FastAPI, Next.js, API communication, attempt handling, and automated tests verified.
- PostgreSQL persistence layer added with SQLAlchemy and Psycopg.
- Alembic initial migration added for learners, content metadata, attempts, progress, and mastery.
- Local PostgreSQL Docker Compose service added.
- Learning Engine now routes lesson and attempt operations through the persistence repository.

## Selected Stack

Next.js + TypeScript + Tailwind CSS → FastAPI/Python → PostgreSQL → Supabase Auth/Storage adapters → Git-based Markdown/MDX content → provider-neutral LLM layer → isolated execution workers → Vitest/Playwright/pytest → Vercel + container deployment.

## Open-Source Strategy

Use multiple open-source projects through reference patterns, compatible dependencies, and isolated adapters where appropriate. Direct code reuse is currently limited to components with verified compatible licensing. MIT candidates currently prioritized include Cairn, AI Deep Dive, and vibe-learn. GPL/AGPL projects such as Adapt and LearnHouse remain reference-only unless a deliberate license strategy is approved.

## In Progress

Verify the PostgreSQL persistence milestone locally and prove that learner, lesson, attempt, and progress state survives API requests.

## Next Task

Run the persistence verification: install new API dependencies → start PostgreSQL → run Alembic migrations → start FastAPI → verify VLOOKUP resolution from PostgreSQL → submit an attempt → query persistence → run pytest.

## Do Not Work On Yet

- Do not build all 50+ skill libraries.
- Do not build advanced AI agents.
- Do not optimize deployment infrastructure.
- Do not add unnecessary integrations.
- Do not begin large-scale UI implementation before persistence is verified.
- Do not introduce microservices without a measured requirement.
- Do not expose untrusted Python/SQL execution publicly before sandbox security controls are implemented and tested.

## Working Rule

Only the current milestone should drive implementation. New ideas belong in `docs/FUTURE.md` until they are intentionally promoted into the roadmap.
