# Ilm-os Technical Requirements

## Functional Requirements

### Learning

- The system must resolve a learner request to a skill/topic where possible.
- The system must load a versioned curriculum.
- The system must support prerequisites and learning objectives.
- The system must deliver structured lessons.
- The system must support guided and independent practice.
- The system must record attempts.
- The system must support assessments.
- The system must maintain learner progress.
- The system must maintain concept-level mastery evidence.
- The system must determine an appropriate next learning action.

### Skill Libraries

- Skill content must be independent from presentation code.
- Skill libraries must follow the canonical schema.
- Skill content must be versionable.
- A new skill should not require changes to core Learning Engine logic unless it introduces a genuinely new capability.

### AI Tutor

- AI responses must receive current learning context.
- AI should provide hints before full solutions where appropriate.
- AI should explain learner errors.
- AI must not silently alter authoritative assessment results.
- AI provider integration must be replaceable.

### Interactive Execution

- Domain-specific execution must be isolated.
- Execution must have resource and time limits.
- Execution must produce structured results that the Learning Engine can evaluate.

## Non-Functional Requirements

### Maintainability

- Clear module boundaries.
- Typed contracts where supported by the selected stack.
- Automated tests for core learning logic.
- Documented architectural decisions.

### Security

- Authentication and authorization where user data requires it.
- Secure session handling.
- Input validation.
- Sandboxed code/SQL execution.
- Secrets kept outside source control.
- Auditability for important learner-state mutations.

### Reliability

- Learning progress should survive application restarts.
- Assessment attempts should not be silently lost.
- Core domain operations should be deterministic where possible.

### Accessibility

- Keyboard navigation.
- Semantic structure.
- Sufficient contrast.
- Screen-reader considerations.
- Avoid reliance on color alone.

### Performance

- Fast initial lesson loading.
- Avoid unnecessary AI calls.
- Cache immutable/versioned learning content where appropriate.
- Keep interactive execution isolated from the main request path when required.

### Extensibility

The architecture must support adding new skill libraries and domain adapters without rewriting the Learning Engine.

## Technology Selection Criteria

Any candidate stack must be evaluated against:

1. Developer productivity
2. Type safety / correctness
3. Database support
4. Authentication options
5. AI integration flexibility
6. Interactive execution support
7. Testing ecosystem
8. Deployment cost
9. Open-source compatibility
10. Long-term maintainability

No technology is selected by popularity alone.
