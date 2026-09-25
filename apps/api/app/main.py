from dataclasses import asdict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.application.learning_service import LearningService
from app.domain.models import Attempt

app = FastAPI(title="Ilm-os API", version="0.1.0")
learning_service = LearningService()


class LearnRequest(BaseModel):
    learner_id: str
    message: str


class AttemptRequest(BaseModel):
    learner_id: str
    exercise_id: str
    answer: str
    correct: bool


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/learning/start")
def start_learning(payload: LearnRequest) -> dict:
    try:
        response = learning_service.start_learning(payload.learner_id, payload.message)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return asdict(response)


@app.post("/api/learning/attempt")
def submit_attempt(payload: AttemptRequest) -> dict:
    attempt = Attempt(
        exercise_id=payload.exercise_id,
        learner_id=payload.learner_id,
        answer=payload.answer,
        correct=payload.correct,
    )
    progress = learning_service.evaluate_attempt(attempt)
    return {"attempt": asdict(attempt), "progress": asdict(progress)}
