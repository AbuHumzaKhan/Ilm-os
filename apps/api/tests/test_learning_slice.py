import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.application.learning_service import LearningService
from app.domain.models import Attempt
from app.infrastructure.db import Base
from app.infrastructure.db_models import ConceptRecord, ExerciseRecord, LessonRecord, SkillRecord, TopicRecord
from app.infrastructure.repository import LearningRepository


@pytest.fixture
def session() -> Session:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(SkillRecord(id="excel", name="Excel", description="Microsoft Excel skills", version="0.1.0"))
        db.add(TopicRecord(id="lookup-functions", skill_id="excel", name="Lookup Functions"))
        db.add(ConceptRecord(id="vlookup", topic_id="lookup-functions", name="VLOOKUP"))
        db.add(LessonRecord(
            id="vlookup-basics",
            concept_id="vlookup",
            title="VLOOKUP Fundamentals",
            objective="Use VLOOKUP to retrieve a value from a structured table using an exact match.",
            content="VLOOKUP searches for a value in the first column of a table and returns a value from another column in the same row.",
            content_version="0.1.0",
        ))
        db.add(ExerciseRecord(
            id="vlookup-basic-exercise",
            lesson_id="vlookup-basics",
            prompt="Use VLOOKUP with an exact match to retrieve the value for E102 from A2:D10.",
            expected_answer='=VLOOKUP("E102",A2:D10,4,FALSE)',
        ))
        db.commit()
        yield db


def test_vlookup_request_resolves_to_persisted_lesson(session: Session) -> None:
    service = LearningService(LearningRepository(session))
    response = service.start_learning("learner-1", "Teach me VLOOKUP")

    assert response.skill_id == "excel"
    assert response.topic_id == "lookup-functions"
    assert response.concept_id == "vlookup"
    assert response.lesson.title == "VLOOKUP Fundamentals"
    assert response.exercise.id == "vlookup-basic-exercise"
    assert response.exercise.prompt == "Use VLOOKUP with an exact match to retrieve the value for E102 from A2:D10."


def test_correct_attempt_persists_completed_progress(session: Session) -> None:
    service = LearningService(LearningRepository(session))
    progress = service.evaluate_attempt(
        Attempt(
            exercise_id="vlookup-basic-exercise",
            learner_id="learner-1",
            answer='=VLOOKUP("E102",A2:D10,4,FALSE)',
            correct=True,
        )
    )

    assert progress.status == "completed"
