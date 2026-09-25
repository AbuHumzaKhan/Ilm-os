from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.models import Attempt, Lesson, Progress
from app.infrastructure.db_models import (
    AttemptRecord,
    ExerciseRecord,
    LearnerRecord,
    LessonRecord,
    ProgressRecord,
)


class LearningRepository:
    def __init__(self, session: Session):
        self.session = session

    def ensure_learner(self, learner_id: str) -> LearnerRecord:
        learner = self.session.get(LearnerRecord, learner_id)
        if learner is None:
            learner = LearnerRecord(id=learner_id)
            self.session.add(learner)
            self.session.flush()
        return learner

    def get_lesson(self, lesson_id: str) -> Lesson | None:
        record = self.session.get(LessonRecord, lesson_id)
        if record is None:
            return None
        return Lesson(
            id=record.id,
            concept_id=record.concept_id,
            title=record.title,
            objective=record.objective,
            content=record.content,
        )

    def get_exercise(self, exercise_id: str) -> ExerciseRecord | None:
        return self.session.get(ExerciseRecord, exercise_id)

    def record_attempt(self, attempt: Attempt, lesson_id: str) -> Progress:
        self.ensure_learner(attempt.learner_id)
        record = AttemptRecord(
            learner_id=attempt.learner_id,
            exercise_id=attempt.exercise_id,
            answer=attempt.answer,
            correct=attempt.correct,
            score=100 if attempt.correct else 0,
        )
        self.session.add(record)

        status = "completed" if attempt.correct else "in_progress"
        progress = self.session.execute(
            select(ProgressRecord).where(
                ProgressRecord.learner_id == attempt.learner_id,
                ProgressRecord.lesson_id == lesson_id,
            )
        ).scalar_one_or_none()

        if progress is None:
            progress = ProgressRecord(
                learner_id=attempt.learner_id,
                lesson_id=lesson_id,
                status=status,
            )
            self.session.add(progress)
        else:
            progress.status = status
            progress.updated_at = datetime.now(timezone.utc)

        self.session.commit()
        return Progress(
            learner_id=attempt.learner_id,
            lesson_id=lesson_id,
            status=status,
        )
