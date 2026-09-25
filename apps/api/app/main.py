from dataclasses import asdict

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.application.learning_service import LearningService
from app.domain.models import Attempt
from app.infrastructure.db import get_session
from app.infrastructure.repository import LearningRepository

app = FastAPI(title="Ilm-os API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LearnRequest(BaseModel):
    learner_id: str
    message: str


class AttemptRequest(BaseModel):
    learner_id: str
    exercise_id: str
    answer: str
    # Kept optional for backward compatibility. The server is authoritative.
    correct: bool | None = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/learning/start")
def start_learning(payload: LearnRequest, session: Session = Depends(get_session)) -> dict:
    service = LearningService(LearningRepository(session))
    try:
        response = service.start_learning(payload.learner_id, payload.message)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return asdict(response)


@app.post("/api/learning/attempt")
def submit_attempt(payload: AttemptRequest, session: Session = Depends(get_session)) -> dict:
    repository = LearningRepository(session)
    service = LearningService(repository)
    exercise = repository.get_exercise(payload.exercise_id)

    if exercise is None:
        raise HTTPException(status_code=404, detail=f"Exercise not found: {payload.exercise_id}")

    # Never trust correctness supplied by the browser. The expected answer stays
    # on the server and is used only for evaluation.
    correct = payload.answer.strip().casefold() == exercise.expected_answer.strip().casefold()

    attempt = Attempt(
        exercise_id=payload.exercise_id,
        learner_id=payload.learner_id,
        answer=payload.answer,
        correct=correct,
    )

    try:
        progress = service.evaluate_attempt(attempt)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return {"attempt": asdict(attempt), "progress": asdict(progress)}
