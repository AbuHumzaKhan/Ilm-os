# Ilm-os Domain Model

**Status:** Draft specification for Phase 0

This document defines the canonical domain entities for the Ilm-os Learning Engine. It is intentionally implementation-independent: database tables, ORM models, API DTOs, and frontend types must derive from these concepts rather than redefine them independently.

## 1. Entity Map

```text
Skill
 ├── Topic
 │    └── Concept
 ├── Prerequisite → Concept / Skill
 ├── LearningObjective
 └── Curriculum
      └── Module
           └── Lesson
                ├── ContentBlock
                ├── Exercise
                └── KnowledgeCheck

Exercise
 └── Attempt

Assessment
 ├── AssessmentItem
 └── Attempt

Learner
 ├── LearnerSkillState
 ├── LearnerConceptState
 ├── Attempt
 ├── Mastery
 └── LearningSession

Mastery
 └── evidence from Attempts / Assessments / Projects
```

## 2. Skill

A top-level learning domain or coherent professional capability.

### Required fields

- `id`: stable unique identifier
- `slug`: human-readable stable identifier
- `name`: display name
- `description`: purpose and scope
- `domain`: broad category
- `status`: planned | active | deprecated
- `version`: content version
- `prerequisites`: references to prerequisite skills/concepts
- `objectives`: learning objectives
- `curriculum`: ordered curriculum reference
- `mastery_policy`: rules for determining mastery

### Example

```yaml
id: skill.excel
slug: excel
name: Microsoft Excel
```

## 3. Topic

A coherent area within a Skill.

Examples: `Lookup Functions`, `PivotTables`, `SQL JOINs`, `Python Functions`.

### Required fields

- `id`
- `skill_id`
- `slug`
- `name`
- `description`
- `order`
- `prerequisites`
- `concept_ids`

## 4. Concept

The smallest meaningful knowledge unit whose understanding can be taught and assessed.

### Required fields

- `id`
- `topic_id`
- `slug`
- `name`
- `description`
- `type`: conceptual | procedural | factual | troubleshooting | strategic
- `prerequisite_concept_ids`
- `objective_ids`
- `difficulty`

Example: `VLOOKUP.range_lookup`.

## 5. LearningObjective

An observable capability the learner should demonstrate.

### Required fields

- `id`
- `statement`
- `verb`: explain | identify | apply | create | debug | analyze | compare | design | evaluate
- `concept_ids`
- `assessment_criteria`

Objectives must describe observable outcomes, not vague completion states such as "understand VLOOKUP".

## 6. Curriculum

The ordered and adaptive learning path for a Skill.

### Required fields

- `id`
- `skill_id`
- `version`
- `modules`
- `default_sequence`
- `adaptive_rules`

The sequence is a recommendation, not necessarily a rigid path. Learner evidence may cause the engine to skip, repeat, remediate, or accelerate content.

## 7. Module

A logical grouping of lessons within a curriculum.

### Required fields

- `id`
- `curriculum_id`
- `name`
- `description`
- `order`
- `lesson_ids`
- `completion_policy`

## 8. Lesson

A teachable unit that combines explanation, demonstration, interaction, and checks.

### Required fields

- `id`
- `module_id`
- `title`
- `objective_ids`
- `concept_ids`
- `prerequisite_ids`
- `content_blocks`
- `exercise_ids`
- `knowledge_check_ids`
- `estimated_minutes`
- `difficulty`
- `completion_policy`

### Content block types

- context
- explanation
- demonstration
- example
- code/formula
- visual
- warning
- common_mistake
- summary

A lesson should normally move from explanation toward application rather than ending at passive reading.

## 9. Exercise

A task requiring the learner to perform an action.

### Required fields

- `id`
- `lesson_id`
- `type`
- `prompt`
- `objective_ids`
- `concept_ids`
- `difficulty`
- `input_definition`
- `expected_output`
- `evaluation_policy`
- `hint_policy`
- `solution`

### Exercise types

- guided
- independent
- debugging
- scenario
- transfer
- project

Solutions may be hidden from the learner until the appropriate hint/reveal policy permits them.

## 10. Assessment

A structured measurement of learner capability across one or more concepts/objectives.

### Required fields

- `id`
- `scope`: lesson | topic | skill | project
- `item_ids`
- `attempt_policy`
- `passing_policy`
- `mastery_policy`

### Assessment item types

- recall
- conceptual
- practical
- debugging
- scenario
- transfer

Assessment is evidence for mastery; completion alone is not mastery.

## 11. Learner

A person using Ilm-os to learn.

### Core fields

- `id`
- `profile`
- `preferences`
- `created_at`
- `updated_at`

The learner entity should not contain derived mastery values directly. Those belong to learner-state/mastery entities so they can be recalculated and audited.

## 12. LearningSession

A bounded period of learner activity.

### Fields

- `id`
- `learner_id`
- `started_at`
- `ended_at`
- `context`
- `activity_ids`

The session provides context for conversational tutoring and progress events without becoming the source of truth for mastery.

## 13. Attempt

A single learner submission or response to an Exercise or AssessmentItem.

### Required fields

- `id`
- `learner_id`
- `target_id`
- `target_type`: exercise | assessment_item
- `session_id`
- `submitted_at`
- `response`
- `evaluation`
- `score`
- `correct`
- `hints_used`
- `duration_seconds`
- `feedback`

Attempts are immutable evidence. Corrections should create new attempts rather than silently overwriting previous ones.

## 14. Mastery

The engine's current evidence-based estimate of a learner's capability for a concept, topic, or skill.

### Required fields

- `id`
- `learner_id`
- `target_id`
- `target_type`: concept | topic | skill
- `level`
- `score`
- `confidence`
- `evidence_count`
- `last_assessed_at`
- `status`
- `weaknesses`
- `strengths`

### Mastery levels

```text
not_started
introduced
developing
proficient
mastered
```

The exact numerical scoring algorithm is intentionally not fixed in this Phase 0 document. It must be designed with the assessment engine and validated against real learning behavior.

## 15. LearnerConceptState

A derived/current state used by the recommendation engine.

It may include:

- current mastery
- last activity
- attempt history reference
- mistake patterns
- confidence
- recommended remediation
- review due date

## 16. Relationships

```text
Skill 1 ──── * Topic
Topic 1 ─── * Concept
Skill 1 ─── 1 Curriculum
Curriculum 1 ─── * Module
Module 1 ─── * Lesson
Lesson * ─── * Concept
Lesson 1 ─── * Exercise
Exercise 1 ─── * Attempt
Assessment 1 ─── * AssessmentItem
AssessmentItem 1 ─── * Attempt
Learner 1 ─── * LearningSession
Learner 1 ─── * Attempt
Learner 1 ─── * Mastery
```

## 17. Source-of-Truth Rules

1. Skill content is owned by Skill Libraries.
2. Learning structure is owned by the Learning Engine.
3. Learner evidence is represented by immutable Attempts and assessment results.
4. Mastery is derived from evidence and can be recalculated.
5. AI-generated explanations are not authoritative learner-state data.
6. The UI must not independently calculate mastery or curriculum progression.

## 18. Versioning

Skill content, curricula, lessons, exercises, and assessments must be versionable. Learner evidence must retain references to the content version used when the evidence was generated.

This prevents a later curriculum edit from making historical learner results ambiguous.

## 19. Non-Goals for This Specification

This document does not yet define:

- database technology
- API framework
- authentication provider
- LLM provider
- vector database
- UI framework
- exact mastery algorithm
- exact recommendation algorithm

Those decisions follow after the domain model is accepted.
