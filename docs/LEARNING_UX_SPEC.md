# Ilm-os Learning UX Specification

## Objective

Provide a calm, structured, multi-page learning environment where a learner can move naturally between learning, practice, assessment, problem solving, video, projects, notes, and progress without losing context.

The interface should feel like a professional learning product rather than a generic chatbot or content website.

## Primary Navigation

1. Home / Learning Dashboard
2. Learn
3. Practice
4. Problems
5. Quiz
6. Video
7. Projects
8. Notes
9. Progress
10. Skills / Library

## Global UX Principles

- Preserve learner context across pages.
- Keep the current skill and topic visible.
- Never force the learner to restart a lesson after switching activities.
- Use progressive disclosure: show essential information first and advanced controls when needed.
- Provide clear primary and secondary actions.
- Avoid unnecessary modal dialogs.
- Provide keyboard-friendly interactions.
- Support responsive layouts.
- Use readable typography and generous spacing.
- Keep feedback close to the action that caused it.
- Distinguish learning, practice, assessment, and reference states clearly.
- Provide autosave for learner-generated work where appropriate.
- Always provide a clear route back to the current learning path.

## Page Specifications

### 1. Learning Dashboard

Purpose: orient the learner immediately.

Core areas:
- Continue Learning
- Current skill/topic
- Recommended next action
- Recently learned
- Weak areas needing review
- Active projects
- Overall learning progress
- Quick access to Practice, Problems, Quiz, and Video

### 2. Learn Page

Purpose: structured instruction.

Layout:
- course/topic breadcrumb
- lesson navigation
- learning objective
- lesson content
- examples
- interactive demonstrations
- notes/bookmark controls
- knowledge checks
- previous/next lesson controls
- contextual AI tutor panel

The learner should always know:
`Where am I? → What am I learning? → Why does it matter? → What do I do next?`

### 3. Practice Page

Purpose: deliberate hands-on practice.

Support:
- guided mode
- independent mode
- hints
- attempt history
- answer validation
- explanation after attempt
- difficulty indicator
- reset/retry
- workspace appropriate to the skill

### 4. Problems Page

Purpose: realistic problem solving rather than lesson repetition.

Each problem should expose:
- scenario
- business/context background
- objective
- available data/tools
- constraints
- workspace
- hints
- submit/check
- solution explanation
- related concepts

### 5. Quiz Page

Purpose: knowledge and understanding assessment.

Support:
- multiple question types
- progress indicator
- question navigation where appropriate
- answer review
- explanations
- final score/result
- weak-concept breakdown
- recommended remediation

Do not make quiz results the sole definition of mastery.

### 6. Video Page

Purpose: supplementary visual learning.

Features:
- video player
- chapter markers
- transcript
- synchronized lesson concepts
- bookmarks
- notes
- related practice
- related lesson
- completion state

Video is a learning resource, not the primary curriculum structure.

### 7. Projects Page

Purpose: integrate skills into realistic work.

Features:
- project brief
- objectives
- requirements
- milestones
- workspace
- resources
- submission/checkpoint
- feedback
- completion criteria
- portfolio-ready output where appropriate

### 8. Notes Page

Purpose: personal knowledge management.

Features:
- notes by skill/topic
- lesson-linked notes
- search
- tags
- bookmarks
- code/formula snippets
- quick capture

### 9. Progress Page

Purpose: show meaningful learning progress.

Show:
- skills started/completed
- concept mastery
- practice performance
- assessment history
- recurring mistakes
- strengths
- weak areas
- learning activity
- project progress

Avoid vanity metrics as the primary measure.

### 10. Skills / Library Page

Purpose: discover available learning paths.

Features:
- domains
- skill search
- difficulty
- prerequisites
- estimated learning effort
- learning outcomes
- curriculum preview
- start/continue action

## Persistent Learning Context

The application should maintain a lightweight context bar or equivalent navigation state containing:

`Skill → Topic → Current Lesson → Progress`

This context should remain available while moving between Learn, Practice, Problems, Quiz, Video, and Projects.

## AI Tutor UX

The AI tutor should be contextual rather than permanently dominant.

Primary actions:
- Explain this
- Give me a hint
- Show an example
- Why is my answer wrong?
- Give me another problem
- Quiz me
- Summarize this
- Connect this to real work

The learner should be able to minimize the tutor and continue working independently.

## Comfort & Accessibility

- Responsive desktop/tablet/mobile layouts.
- Keyboard navigation.
- Focus states.
- Reduced-motion support.
- High-contrast-compatible design.
- Clear error states.
- Non-destructive navigation.
- Autosave where learner work could be lost.
- Confirmation only for genuinely destructive actions.
- No excessive animations.
- No forced dark/light theme assumptions.
- Persistent readable line lengths.

## UX State Model

Every learning page should account for:

- loading
- empty state
- active state
- success
- incorrect answer
- partial progress
- locked prerequisite
- saved state
- unsaved state
- error
- offline/interrupted state where applicable

## Design Direction

Visual direction: clean, modern, focused, professional, calm, and information-rich without visual clutter.

The UI should prioritize learning comprehension over decorative effects.

## Initial UI Scope

The first implementation should establish the shared shell and these core pages:

1. Dashboard
2. Learn
3. Practice
4. Problems
5. Quiz
6. Video
7. Projects
8. Progress

Skills, Notes, and additional supporting pages can follow after the core learning workflow is validated.
