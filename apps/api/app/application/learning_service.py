from dataclasses import dataclass

from app.domain.models import Attempt, Lesson, Progress


@dataclass(frozen=True)
class LearningResponse:
    skill_id: str
    topic_id: str
    concept_id: str
    lesson: Lesson
    exercise_id: str


class LearningService:
    """First vertical-slice use case: resolve VLOOKUP and return its lesson."""

    def start_learning(self, learner_id: str, request: str) -> LearningResponse:
        normalized = request.strip().lower()
        if "vlookup" not in normalized:
            raise ValueError("This first slice currently supports VLOOKUP only.")

        lesson = Lesson(
            id="vlookup-basics",
            concept_id="vlookup",
            title="VLOOKUP Fundamentals",
            objective="Use VLOOKUP to retrieve a value from a structured table using an exact match.",
            content=(
                "VLOOKUP searches for a value in the first column of a table "
                "and returns a value from another column in the same row."
            ),
        )
        return LearningResponse(
            skill_id="excel",
            topic_id="lookup-functions",
            concept_id="vlookup",
            lesson=lesson,
            exercise_id="vlookup-basic-exercise",
        )

    def evaluate_attempt(self, attempt: Attempt) -> Progress:
        status = "completed" if attempt.correct else "in_progress"
        return Progress(
            learner_id=attempt.learner_id,
            lesson_id="vlookup-basics",
            status=status,
        )
