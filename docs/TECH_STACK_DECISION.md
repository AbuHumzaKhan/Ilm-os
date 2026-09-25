# Ilm-os Technology Stack Decision

## Status

**Accepted for initial implementation**

This document records the technology choices for the first production architecture. Individual technologies remain replaceable behind defined interfaces where practical.

## Executive Decision

| Layer | Selected technology | Role |
|---|---|---|
| Frontend | Next.js + TypeScript | Multi-page learning application, routing, SSR/streaming where useful |
| UI | Tailwind CSS + accessible component primitives | Consistent, responsive learning interface |
| Backend | Python + FastAPI | Learning Engine APIs, orchestration, AI integration, execution control |
| Database | PostgreSQL | Learners, content metadata, progress, attempts, mastery, application data |
| Authentication | Supabase Auth | User identity, sessions, OAuth/passwordless options, authorization integration |
| Storage | S3-compatible object storage / Supabase Storage adapter | Videos, documents, uploads, generated learning assets |
| Content | Versioned Markdown/MDX + YAML/JSON Schema | Human-readable lesson content with machine-validatable metadata |
| AI/LLM | Provider-neutral AI gateway with LiteLLM-compatible abstraction | Replaceable model providers and centralized AI policy |
| Python execution | Isolated container worker | Code exercises and automated tests |
| SQL execution | Ephemeral PostgreSQL sandbox | Safe SQL exercises using controlled datasets |
| Testing | Vitest + Playwright + pytest | Unit, integration, browser, and backend testing |
| Deployment | Vercel for web + container platform for API/workers + managed Postgres initially | Simple production path with independent scaling boundaries |
| Local development | Docker Compose | Reproducible infrastructure and execution services |

## Why This Stack

### Frontend — Next.js + TypeScript

Ilm-os needs a multi-page application with rich interactive learning screens rather than a single static page. Next.js provides routing, server/client rendering choices, and a straightforward deployment path to Vercel. TypeScript provides stronger contracts across a complex UI.

Next.js has first-class deployment support on Vercel, while the application remains portable because the framework itself is open source. The project should avoid proprietary Vercel-only application logic where practical.

### Backend — FastAPI

The Learning Engine is primarily a domain and orchestration system, and Python is also the language used for the future Python learning environment. FastAPI gives the backend a typed HTTP API, Python ecosystem access, and async support where appropriate.

The backend will own authoritative learning operations. The browser must not directly implement mastery, assessment, or learner-state rules.

### Database — PostgreSQL

PostgreSQL is the primary system of record because Ilm-os has strongly related entities: skills, topics, concepts, curriculum, lessons, learners, attempts, assessments, and mastery. Relational constraints are valuable for maintaining consistency.

PostgreSQL Row-Level Security can provide database-level authorization boundaries where appropriate.

### Authentication — Supabase Auth

Supabase Auth is selected initially to avoid spending project effort implementing and maintaining password, session, OAuth, and token infrastructure. It integrates with PostgreSQL and supports common authentication methods.

The application should keep an authentication interface so Supabase Auth can be replaced later if required.

Self-hosted Supabase is also available when operational control or deployment requirements justify it.

### Content — Markdown/MDX + structured metadata

Educational content should be readable and reviewable in Git. Therefore, lesson prose should not be trapped inside database rows or application code.

Use:

```text
content/
  skills/
    excel/
      lookup-functions/
        vlookup/
          skill.yaml
          curriculum.yaml
          lessons/
          exercises/
          assessments/
```

Structured metadata is validated against the canonical Learning Engine schema. Rich lesson presentation can use MDX where interactive components are genuinely required.

The database stores runtime learner state and indexed content metadata; Git remains the authoritative source for versioned educational content in the initial architecture.

### AI/LLM — Provider-neutral abstraction

The Learning Engine must not depend directly on one model provider.

Use an internal interface such as:

```text
LLMProvider
├── generate()
├── stream()
└── structured_output()
```

A provider gateway can route to different commercial or self-hosted models. The application should log model/provider metadata for reproducibility without storing unnecessary sensitive prompts or personal data.

AI is an assistant to the deterministic Learning Engine, not the source of truth for curriculum, assessment scores, or mastery state.

### Python execution sandbox

Python learner code will execute outside the API process in isolated workers.

Minimum production controls:

- non-root execution
- CPU limits
- memory limits
- wall-clock timeout
- process count limits
- restricted filesystem
- no application secrets
- restricted or disabled network
- ephemeral filesystem
- controlled package/runtime image
- worker-level observability

Docker containers are appropriate for the initial architecture, but container isolation alone should not be treated as an absolute security boundary for hostile multi-tenant execution. Stronger isolation can be introduced before public untrusted-code execution at scale.

### SQL sandbox

SQL exercises will use isolated, short-lived PostgreSQL environments or isolated databases/schemas with controlled permissions.

Learners must never receive access to the production database.

Each exercise should have:

```text
Dataset snapshot
+ learner query
+ execution limits
+ expected result / tests
= evaluation result
```

Query timeout, statement restrictions, resource limits, and database permissions are mandatory before exposing the feature publicly.

### Storage

Use an S3-compatible storage abstraction. Supabase Storage can provide the initial implementation, with the interface allowing migration to another S3-compatible provider or self-hosted storage later.

Large video assets should not be stored in PostgreSQL.

### Testing

Use different tools for different layers:

- pytest — Python backend and Learning Engine
- Vitest — TypeScript/frontend unit tests
- Playwright — end-to-end browser workflows
- schema validation tests — skill/content contracts
- sandbox integration tests — Python and SQL execution

The first critical end-to-end test should cover:

```text
"Teach me VLOOKUP"
→ skill resolution
→ curriculum selection
→ lesson
→ exercise
→ attempt
→ assessment
→ mastery update
```

### Deployment

Initial production deployment should remain operationally simple:

```text
Browser
  ↓
Next.js / Vercel
  ↓
FastAPI application
  ├── PostgreSQL
  ├── Object Storage
  ├── AI Provider
  └── Execution Workers
```

The API and sandbox workers should be independently deployable containers. Vercel is not required for the Python execution layer.

### Open-source compatibility

The selected core technologies are open-source or have open-source implementations. Ilm-os itself remains MIT-licensed.

Important distinction: an open-source application can still call a proprietary hosted AI provider. The provider choice must therefore remain replaceable.

Before adding any dependency, license compatibility must be checked against the dependency's actual release/license and the project's distribution model.

## Alternatives Considered

### Full TypeScript stack

**Option:** Next.js + Node.js/NestJS + PostgreSQL.

**Reason not selected:** It would simplify language consistency but makes the Python execution/data-science ecosystem less direct. Ilm-os is explicitly designed to teach Python and data skills, so Python is strategically useful in the backend.

### Full Python web stack

**Option:** Django + templates/React.

**Reason not selected:** Django is capable, but the interactive multi-page learning application benefits from a dedicated modern TypeScript frontend and a focused API backend.

### Supabase as the entire backend

**Option:** Next.js + Supabase with minimal custom backend.

**Reason not selected:** Ilm-os contains substantial domain logic, adaptive learning, assessment, sandbox orchestration, and AI workflows. Those should live in an explicit backend rather than becoming a collection of database triggers and frontend calls.

### Microservices from day one

**Reason rejected:** They add operational complexity before there is evidence that Ilm-os needs it. We will use modular boundaries and extract services only when workload or security isolation justifies it.

## Cost Strategy

The development stack should support a low-cost/free development path:

- open-source frameworks locally
- PostgreSQL locally through Docker
- local content in Git
- local execution workers
- optional hosted AI providers
- Vercel free/low-cost deployment where appropriate
- managed database/storage initially where the free/low-cost tier is sufficient

AI inference and sandbox execution are the main variable costs and must therefore be architected behind quotas, caching, and provider abstraction.

## Scalability Strategy

Start as a modular application:

```text
Web
  ↓
API
  ↓
Postgres
```

Add independent workers when needed:

```text
API
 ├── Learning worker
 ├── AI worker
 ├── Python sandbox worker
 └── SQL sandbox worker
```

Only introduce queues, separate services, or distributed infrastructure when measurements justify them.

## Decision Summary

The initial Ilm-os stack is:

**Next.js + TypeScript + Tailwind → FastAPI/Python → PostgreSQL → Supabase Auth/Storage adapters → Git-based Markdown/MDX content → provider-neutral LLM layer → isolated execution workers → Playwright/Vitest/pytest → Vercel + container deployment.**

This stack is optimized for the project's actual requirements: structured learning, interactive practice, Python/data education, strong domain modeling, open-source development, and a path from a small initial deployment to a much larger platform.
