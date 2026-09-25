# Ilm-os Implementation Architecture

## Status

Accepted baseline — implementation planning layer.

## Repository Structure

```text
Ilm-os/
├── apps/
│   ├── web/                         # Next.js learner-facing application
│   │   ├── app/                     # routes/pages
│   │   ├── components/              # reusable UI
│   │   ├── features/                # feature-level UI and client workflows
│   │   ├── lib/                     # frontend adapters/utilities
│   │   └── tests/                   # frontend tests
│   │
│   └── api/                         # FastAPI application
│       ├── app/
│       │   ├── api/                 # HTTP routers
│       │   ├── application/         # use cases/services
│       │   ├── domain/               # Learning Engine domain
│       │   ├── infrastructure/       # DB, AI, storage, external adapters
│       │   └── main.py
│       └── tests/
│
├── content/
│   ├── skills/                      # versioned skill libraries
│   │   ├── excel/
│   │   ├── sql/
│   │   ├── python/
│   │   └── ...
│   ├── shared/                      # reusable educational fragments
│   └── schemas/                     # content validation schemas
│
├── packages/
│   ├── contracts/                   # API/content shared contracts
│   ├── ui/                          # shared UI primitives when justified
│   └── config/                      # shared lint/TS/config packages
│
├── workers/
│   ├── python-runner/               # isolated Python execution worker
│   ├── sql-runner/                  # isolated SQL execution worker
│   └── content-worker/              # content generation/validation jobs
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── fixtures/
│
├── tests/
│   ├── contract/
│   ├── integration/
│   └── e2e/
│
├── infra/
│   ├── docker/
│   └── deployment/
│
├── scripts/
├── docs/
└── .github/
    └── workflows/
```

## Web Application

The Next.js application owns presentation and browser interaction, not core learning decisions.

```text
apps/web/app/
├── (public)/
├── (auth)/
├── dashboard/
├── skills/
├── learn/
├── lesson/
├── practice/
├── problems/
├── quiz/
├── video/
├── projects/
├── notes/
├── progress/
└── settings/
```

The exact route grouping may change during implementation, but the product concepts remain stable.

## API Application

FastAPI is organized by responsibility:

```text
apps/api/app/
├── api/
│   ├── routes/
│   └── dependencies.py
├── application/
│   ├── learning/
│   ├── practice/
│   ├── assessment/
│   ├── progress/
│   ├── tutor/
│   └── content/
├── domain/
│   ├── entities/
│   ├── value_objects/
│   ├── services/
│   ├── repositories/
│   └── events/
├── infrastructure/
│   ├── database/
│   ├── ai/
│   ├── storage/
│   ├── auth/
│   └── integrations/
└── main.py
```

## Learning Engine Boundary

The Learning Engine lives inside the backend domain/application layers. It must remain independent of HTTP and UI details.

```text
HTTP Request
    ↓
API Route
    ↓
Application Use Case
    ↓
Learning Engine
    ↓
Repository / Adapter interfaces
    ↓
Infrastructure implementation
```

Example:

```text
POST /learning/sessions
       ↓
StartLearningSession
       ↓
ResolveSkill
       ↓
CheckPrerequisites
       ↓
DetermineNextAction
       ↓
CreateSession
```

## Domain Model Location

```text
apps/api/app/domain/entities/
├── skill.py
├── topic.py
├── concept.py
├── lesson.py
├── exercise.py
├── assessment.py
├── learner.py
├── attempt.py
└── mastery.py
```

Persistence models must not become the domain model by accident.

## API Contracts

Canonical request/response schemas belong in the backend contract layer and are mirrored into `packages/contracts` only when cross-application sharing is genuinely useful.

```text
packages/contracts/
├── learning/
├── assessment/
├── practice/
├── progress/
└── tutor/
```

## Content Architecture

Skill libraries are data/content, not backend source code.

Example:

```text
content/skills/excel/lookup-functions/vlookup/
├── skill.yaml
├── curriculum.yaml
├── concepts/
├── lessons/
├── exercises/
├── assessments/
├── projects/
└── assets/
```

Each skill library must validate against the canonical content schema before being published.

## External Open-Source Components

Ilm-os will use external open-source projects through clearly defined adapters or isolated build/runtime boundaries rather than copying unrelated applications wholesale.

The first candidate component registry is maintained in `docs/OPEN_SOURCE_COMPONENTS.md`.

Important rule: **open source does not automatically mean MIT-compatible.** Each dependency must pass license review before code is incorporated into Ilm-os.

## Execution Workers

### Python

```text
apps/api
  ↓
Execution Job
  ↓
workers/python-runner
  ↓
Ephemeral sandbox
  ↓
Structured result
```

### SQL

```text
apps/api
  ↓
Execution Job
  ↓
workers/sql-runner
  ↓
Ephemeral PostgreSQL database
  ↓
Tests/evaluation
  ↓
Structured result
```

Workers must never receive production credentials or unrestricted application-network access.

## AI Provider Layer

```text
application/tutor
        ↓
infrastructure/ai/provider.py
        ↓
Provider interface
   ┌────┼────┐
   ↓    ↓    ↓
OpenAI  ...  Local/Open-compatible
```

AI generation must remain replaceable.

## Database

PostgreSQL persistence is divided conceptually into:

```text
database/migrations/
├── users
├── skills
├── curricula
├── lessons
├── exercises
├── assessments
├── learning_sessions
├── attempts
├── mastery
└── progress/events
```

The exact migration sequence will be created after the first implementation contracts are frozen.

## Testing Strategy

```text
Unit
  ↓
Domain + Learning Engine

Integration
  ↓
API + DB + adapters

Contract
  ↓
Frontend/API/content contracts

E2E
  ↓
Learner journeys

Security
  ↓
Sandbox + auth + authorization
```

## Development Principle

Build one vertical slice at a time:

```text
Content
 → Domain
 → Use Case
 → API
 → UI
 → Test
```

The first vertical slice will be one complete learning journey, not the entire platform.
