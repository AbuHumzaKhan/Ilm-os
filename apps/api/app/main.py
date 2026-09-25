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
    allow_origins=["http://localhost:3000"],
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
    correct: bool


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
    service = LearningService(LearningRepository(session))
    attempt = Attempt(
        exercise_id=payload.exercise_id,
        learner_id=payload.learner_id,
        answer=payload.answer,
        correct=payload.correct,
    )
    try:
        progress = service.evaluate_attempt(attempt)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return {"attempt": asdict(attempt), "progress": asdict(progress)}
