from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True)
class Skill:
    id: str
    name: str
    description: str


@dataclass(frozen=True)
class Topic:
    id: str
    skill_id: str
    name: str


@dataclass(frozen=True)
class Concept:
    id: str
    topic_id: str
    name: str


@dataclass(frozen=True)
class Lesson:
    id: str
    concept_id: str
    title: str
    objective: str
    content: str


@dataclass(frozen=True)
class Exercise:
    id: str
    lesson_id: str
    prompt: str
    expected_answer: str


@dataclass(frozen=True)
class Attempt:
    exercise_id: str
    learner_id: str
    answer: str
    correct: bool


@dataclass(frozen=True)
class Progress:
    learner_id: str
    lesson_id: str
    status: Literal["not_started", "in_progress", "completed"]
