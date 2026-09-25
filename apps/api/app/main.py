from dataclasses import asdict

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.application.learning_service import LearningService
from app.application.python_execution import PythonExecutionError, execute_python
from app.domain.models import Attempt
from app.infrastructure.db import get_session
from app.infrastructure.repository import LearningRepository

app = FastAPI(title="Ilm-os API", version="0.3.0")

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
    correct: bool | None = None


class PythonExecutionRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20_000)
    columns: list[str] = Field(min_length=1, max_length=50)
    rows: list[list[object]] = Field(max_length=5_000)


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


@app.post("/api/python/execute")
def execute_python_code(payload: PythonExecutionRequest) -> dict[str, object]:
    if any(len(row) != len(payload.columns) for row in payload.rows):
        raise HTTPException(status_code=422, detail="Dataset rows do not match the column count.")

    try:
        return execute_python(payload.code, payload.columns, payload.rows)
    except PythonExecutionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
