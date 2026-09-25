# Ilm-os Open-Source Integration Strategy

## Objective

Use multiple mature open-source projects to accelerate course creation, lessons, exercises, quizzes, practice, spaced repetition, and interactive learning without turning Ilm-os into a fragile collection of copied applications.

## Integration Levels

### Level 1 — Learn from the architecture

Study a repository's design and implement the required capability in Ilm-os using our own domain model.

### Level 2 — Content/tool format compatibility

Support an established format or workflow without copying the source project.

### Level 3 — Isolated adapter

Run a compatible external component separately and communicate through a stable interface.

### Level 4 — Direct dependency

Add a library/package only when its license, maintenance, security, and API stability have been reviewed.

### Level 5 — Code incorporation

Copy or modify source code only when licensing explicitly permits it and attribution/license obligations are satisfied.

## Proposed Roles

```text
Cairn
 └── AI course/tutor/spaced-review reference

AI Deep Dive
 └── interactive lesson + coding judge reference

vibe-learn
 └── course/content/exercise authoring reference

Ilm-os Learning Engine
 └── authoritative orchestration and learner state
```

## Course Creation Pipeline

The desired future workflow is:

```text
User:
"Create a professional SQL course for data analysts."
                ↓
Goal / audience clarification
                ↓
Learning Engine
                ↓
Skill + prerequisite graph
                ↓
Curriculum generator
                ↓
Lesson generator
                ↓
Exercise generator
                ↓
Quiz generator
                ↓
Real-world problem generator
                ↓
Quality validation
                ↓
Human/author approval where required
                ↓
Versioned Skill Library
```

External projects may provide implementation patterns for individual stages, but Ilm-os owns the final canonical content schema and validation pipeline.

## Quality Gate

AI-generated course material must not automatically become trusted educational content.

Before publication, content should pass:

- schema validation
- prerequisite validation
- objective/assessment alignment checks
- factual/source checks where appropriate
- exercise solvability checks
- code/SQL test validation
- duplicate/redundancy checks
- accessibility checks
- license/source checks for external material
- human review for production-critical curriculum

## Why This Architecture

This gives Ilm-os the ability to benefit from multiple open-source projects while keeping one coherent learner experience and one canonical Learning Engine.

It also prevents a future situation where removing one external repository breaks the entire platform.
