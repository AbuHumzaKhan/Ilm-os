# Ilm-os Domain Model Validation

## Purpose

Validate that the common Learning Engine model can represent different domains without introducing skill-specific exceptions.

## Scenario 1 — Excel / VLOOKUP

```text
Skill: Excel
  Topic: Lookup Functions
    Concept: VLOOKUP
      Concept: Exact Match
```

A lesson can teach syntax and reasoning, an exercise can require formula construction, an attempt records the learner's answer, and mastery can track concept-level and practical performance.

**Result:** Model fits without modification.

## Scenario 2 — SQL / JOIN

```text
Skill: SQL
  Topic: JOINs
    Concept: INNER JOIN
      Concept: Join Keys
```

A lesson can explain relational matching, a SQL exercise can execute a query against a controlled dataset, an attempt can retain the query and execution result, and mastery can measure conceptual understanding plus practical query construction.

**Result:** Model fits without modification.

## Scenario 3 — Python / Pandas DataFrame

```text
Skill: Python Data Stack
  Topic: Pandas
    Concept: DataFrame
      Concept: Filtering
```

A lesson can explain DataFrames, a code exercise can execute learner code in a controlled environment, an attempt can retain the submitted code and test result, and mastery can measure implementation and transfer.

**Result:** Model fits without modification.

## Cross-Domain Findings

The common model supports:

- conceptual learning
- procedural learning
- executable practice
- debugging
- assessment
- learner attempts
- mastery
- prerequisite relationships
- real-world projects

The domain-specific portion should primarily live in the **skill library and workspace adapter**, not in the core Learning Engine.

## Architectural Boundary

```text
Common Learning Engine
        │
        ├── Skill metadata
        ├── Curriculum
        ├── Lessons
        ├── Exercises
        ├── Attempts
        ├── Assessments
        └── Mastery
                │
                ▼
        Domain Adapter / Workspace
          ├── Spreadsheet
          ├── SQL runtime
          └── Code runtime
```

## Decision

The domain model is sufficiently general to proceed to the next layer: **technical architecture and application contracts**.

This validation does not freeze implementation technology. Runtime security, execution isolation, content authoring, persistence, and AI integration remain separate design concerns.
