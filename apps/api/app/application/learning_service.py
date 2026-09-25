from dataclasses import dataclass

from app.domain.models import Attempt, Lesson, Progress
from app.infrastructure.repository import LearningRepository


@dataclass(frozen=True)
class ExerciseSummary:
    id: str
    prompt: str


@dataclass(frozen=True)
class LearningResponse:
    skill_id: str
    topic_id: str
    concept_id: str
    lesson: Lesson
    exercise: ExerciseSummary


class LearningService:
    """Application use cases for the first persisted learning slice."""

    def __init__(self, repository: LearningRepository):
        self.repository = repository

    def start_learning(self, learner_id: str, request: str) -> LearningResponse:
        normalized = request.strip().lower()
        if "vlookup" not in normalized:
            raise ValueError("This first slice currently supports VLOOKUP only.")

        self.repository.ensure_learner(learner_id)
        lesson = self.repository.get_lesson("vlookup-basics")
        exercise = self.repository.get_exercise("vlookup-basic-exercise")
        if lesson is None or exercise is None:
            raise RuntimeError("VLOOKUP learning content is not available in the database.")

        return LearningResponse(
            skill_id="excel",
            topic_id="lookup-functions",
            concept_id="vlookup",
            lesson=lesson,
            exercise=ExerciseSummary(
                id=exercise.id,
                prompt=exercise.prompt,
            ),
        )

    def evaluate_attempt(self, attempt: Attempt) -> Progress:
        exercise = self.repository.get_exercise(attempt.exercise_id)
        if exercise is None:
            raise ValueError(f"Exercise not found: {attempt.exercise_id}")

        return self.repository.record_attempt(attempt, exercise.lesson_id)
