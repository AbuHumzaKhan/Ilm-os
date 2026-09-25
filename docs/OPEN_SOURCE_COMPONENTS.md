# Ilm-os Open-Source Component Registry

## Purpose

Ilm-os can benefit from existing open-source learning engines, course-authoring systems, interactive learning examples, and content-generation workflows. We will reuse proven components where that reduces duplicated engineering work.

However, the project has an intended MIT release. Therefore, **license compatibility must be checked before incorporating code, assets, or libraries into the Ilm-os distribution.** Public GitHub visibility is not a license.

## Tier A — Candidates for Direct MIT-Compatible Reuse

### 1. Cairn — VolarQuill/Cairn

Repository: https://github.com/VolarQuill/Cairn

License reported by the repository: MIT.

Useful capabilities:

- AI course generation
- structured modules and lessons
- adaptive quizzes
- study chat/RAG
- spaced repetition
- local/offline fallback
- provider-agnostic AI integration
- Next.js/Supabase-oriented architecture

Potential Ilm-os use:

- study-session patterns
- course-generation workflow ideas
- AI tutor patterns
- spaced-repetition implementation ideas
- adapter/reference implementation where technically appropriate

Source: repository README and license information reviewed during architecture planning.

### 2. AI Deep Dive — h3nock/ai-deep-dive

Repository: https://github.com/h3nock/ai-deep-dive

License reported by the repository: MIT.

Useful capabilities:

- interactive lessons
- visual learning
- coding challenges
- MDX course content
- Next.js learning UI
- separate judge backend

Potential Ilm-os use:

- interactive lesson patterns
- problem/judge architecture ideas
- content organization
- project/challenge patterns

### 3. vibe-learn — jmilne22/vibe-learn

Repository: https://github.com/jmilne22/vibe-learn

License reported by the repository: MIT.

Useful capabilities:

- Markdown lessons
- YAML exercises
- flashcards
- spaced repetition
- daily practice
- analytics
- real-world challenges
- course scaffolding
- plugin architecture
- AI-assisted course creation workflow

Potential Ilm-os use:

- content schema ideas
- course scaffolding
- exercise formats
- practice/analytics concepts
- plugin boundaries

## Tier B — Useful but License Requires Special Handling

### 4. LearnHouse

Repository: https://github.com/learnhouse/learnhouse

Reported license: AGPL-3.0, with separate enterprise licensing for some features.

It provides a substantial open-source learning platform with courses, a block editor, assignments, discussions, podcasts, and analytics.

Decision:

**Do not copy or incorporate LearnHouse code into the MIT Ilm-os distribution without a dedicated license analysis.** It may be studied for product and architecture ideas, and a separately deployed integration could be considered only after legal review.

### 5. Adapt Framework / Adapt Authoring Tool

Repositories:

- https://github.com/adaptlearning/adapt_framework
- https://github.com/adaptlearning/adapt_authoring

Reported license: GPL-3.0.

Adapt is useful for responsive e-learning authoring, assessments, accessibility, localization, and SCORM-oriented content.

Decision:

**Do not copy GPL code into the MIT Ilm-os codebase without legal review.** Use it as an architectural/reference project unless a compatible distribution strategy is deliberately selected.

## Tier C — Research / Inspiration Until License Is Confirmed

Projects without a clearly verified compatible license should not be treated as reusable code.

Examples may include repositories that describe themselves as open source but do not expose a clear OSI-style license in the repository.

## Reuse Rules

1. Repository existence does not imply permission to reuse code.
2. “Free” does not mean “MIT-compatible.”
3. License must be verified from the repository's actual license file or authoritative project documentation.
4. Preserve required copyright and license notices.
5. Track third-party dependencies in a machine-readable inventory before release.
6. Do not copy entire applications when a small adapter or dependency is sufficient.
7. Prefer MIT/BSD/Apache-2.0 compatible components for direct incorporation into Ilm-os.
8. Keep GPL/AGPL projects outside the distributed core unless a deliberate license strategy is approved.
9. Recheck licenses when updating dependencies because repositories can change licensing or add restrictions.

## Architectural Strategy

Ilm-os should not become a collection of copied repositories.

Instead:

```text
                 Ilm-os Core
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       Learning    Content    Adapters
       Engine      Engine      / Tools
          │          │          │
          └──────┬───┴──────────┘
                 ↓
        Open-source components
        used where appropriate
```

The core domain model and Learning Engine remain Ilm-os-owned architecture.

## Immediate Recommendation

For the first implementation, use the MIT-compatible candidates as references/components where they provide measurable value:

- Cairn → adaptive course/tutor/spaced-review patterns
- AI Deep Dive → interactive lesson and judge patterns
- vibe-learn → content/exercise/course-generation patterns

Do not import LearnHouse or Adapt code into the MIT codebase at this stage.
