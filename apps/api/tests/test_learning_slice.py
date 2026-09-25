from app.application.learning_service import LearningService
from app.domain.models import Attempt


def test_vlookup_request_resolves_to_lesson() -> None:
    response = LearningService().start_learning("learner-1", "Teach me VLOOKUP")

    assert response.skill_id == "excel"
    assert response.topic_id == "lookup-functions"
    assert response.concept_id == "vlookup"
    assert response.lesson.id == "vlookup-basics"
    assert response.exercise_id == "vlookup-basic-exercise"


def test_correct_attempt_completes_progress() -> None:
    progress = LearningService().evaluate_attempt(
        Attempt(
            exercise_id="vlookup-basic-exercise",
            learner_id="learner-1",
            answer='=VLOOKUP("E102",A2:D10,4,FALSE)',
            correct=True,
        )
    )

    assert progress.status == "completed"
