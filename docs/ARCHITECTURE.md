# Ilm-os Architecture

## Architectural Goal

Create a reusable Learning Engine that can power many skill libraries without duplicating the core learning logic.

## High-Level Model

```text
Learner
  ↓
Learning Interface
  ↓
Learning Engine
  ├── Skill Registry
  ├── Curriculum Engine
  ├── Lesson Engine
  ├── Practice Engine
  ├── Assessment Engine
  ├── Mastery Engine
  └── Progress / Learner State
  ↓
Skill Libraries
  ├── Excel
  ├── SQL
  ├── Python
  ├── Data Analytics
  └── 50+ domains
```

## Planned Boundaries

### Learning Engine
Owns reusable learning behavior and learner progression.

### Skill Libraries
Own domain-specific knowledge, curriculum, examples, exercises, projects, and assessment content.

### Interactive Workspaces
Provide specialized environments where a skill requires hands-on execution.

### AI Tutor
Provides contextual explanation, questioning, hints, feedback, and adaptation. It should not replace the deterministic learning and assessment models.

### Learner State
Stores progress, mastery, attempts, mistakes, and learning history according to the final privacy and storage design.

## Architecture Status

This document defines the target boundaries only. Concrete framework, database, AI provider, and deployment decisions are intentionally deferred until requirements and constraints are documented.
