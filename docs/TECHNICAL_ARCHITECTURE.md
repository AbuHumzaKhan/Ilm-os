# Ilm-os Technical Architecture

## Status

Draft — Phase 0 architecture layer.

## Architectural Principle

Ilm-os is a modular learning platform built around a domain-agnostic Learning Engine. Skill libraries provide domain content and domain adapters provide specialized execution environments.

## Logical Layers

```text
┌──────────────────────────────────────────────┐
│ Presentation Layer                           │
│ Dashboard · Chat · Lessons · Practice · UI  │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│ Application Layer                             │
│ Learning sessions · Commands · Workflows     │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────▼───────────────────────┐
│ Learning Engine                              │
│ Curriculum · Lessons · Practice · Assessment │
│ Mastery · Progress · Recommendations         │
└───────────────┬──────────────────┬───────────┘
                │                  │
┌───────────────▼───────┐  ┌──────▼────────────┐
│ Skill Libraries        │  │ Domain Adapters   │
│ Excel · SQL · Python   │  │ Spreadsheet · SQL │
│ 50+ domains            │  │ Python · others  │
└────────────────────────┘  └───────────────────┘
                │                  │
┌───────────────▼──────────────────▼───────────┐
│ Persistence / Infrastructure                 │
│ Learners · Content · Attempts · Progress     │
│ Files · Events · Configuration               │
└──────────────────────────────────────────────┘
```

## Core Components

### 1. Learning Engine

The authoritative business logic for learning progression.

Responsibilities:

- resolve learning paths
- load curriculum
- deliver lessons
- manage exercises
- record attempts
- evaluate assessments
- calculate/update mastery
- determine next learning actions

It should not contain Excel-, SQL-, or Python-specific rules.

### 2. Skill Library

A versioned package of educational content for a domain.

Contains:

- skill metadata
- topics
- concepts
- prerequisites
- objectives
- curriculum
- lessons
- exercises
- assessments
- projects
- mastery configuration

### 3. Domain Adapter

Connects a skill to a specialized practice environment.

Examples:

- Excel → spreadsheet evaluator
- SQL → isolated SQL execution environment
- Python → isolated Python execution environment

Adapters must expose controlled interfaces to the Learning Engine.

### 4. Learner State

Stores durable evidence about the learner, including progress, attempts, mastery, and learning history.

### 5. AI Tutor

A contextual service that assists explanation, questioning, hints, feedback, and adaptation. It consumes authoritative learning context rather than defining the curriculum by itself.

## Dependency Direction

```text
UI
 ↓
Application Services
 ↓
Learning Engine
 ↓
Domain Interfaces
 ↓
Infrastructure Implementations
```

Skill content should depend on defined schemas/contracts, not on UI implementation details.

## Security Boundary

Executable learner code must never run inside the main application process without an explicit isolation design. SQL and Python execution will require sandboxing, resource limits, timeouts, filesystem restrictions, and network policy before production use.

## Scalability Principle

The first production architecture should remain a modular application rather than prematurely splitting the system into microservices. Components may later be extracted when measured operational requirements justify the complexity.

## Technology Selection Gate

Technology choices will be made only after defining:

- functional requirements
- non-functional requirements
- deployment constraints
- expected workload
- execution sandbox requirements
- AI provider requirements
- content authoring requirements
- privacy requirements

The stack is therefore intentionally **not frozen in this document yet**.
