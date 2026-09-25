"""Create initial learning persistence schema.

Revision ID: 0001_initial_learning_persistence
Revises:
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_initial_learning_persistence"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "learners",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "skills",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("version", sa.String(length=50), nullable=False),
    )
    op.create_table(
        "topics",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("skill_id", sa.String(length=100), sa.ForeignKey("skills.id"), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
    )
    op.create_table(
        "concepts",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("topic_id", sa.String(length=100), sa.ForeignKey("topics.id"), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
    )
    op.create_table(
        "lessons",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("concept_id", sa.String(length=100), sa.ForeignKey("concepts.id"), nullable=False),
        sa.Column("title", sa.String(length=250), nullable=False),
        sa.Column("objective", sa.Text(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("content_version", sa.String(length=50), nullable=False),
    )
    op.create_table(
        "exercises",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("lesson_id", sa.String(length=100), sa.ForeignKey("lessons.id"), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("expected_answer", sa.Text(), nullable=False),
    )
    op.create_table(
        "attempts",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("learner_id", sa.String(length=100), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("exercise_id", sa.String(length=100), sa.ForeignKey("exercises.id"), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("correct", sa.Boolean(), nullable=False),
        sa.Column("score", sa.Float(), nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "progress",
        sa.Column("learner_id", sa.String(length=100), sa.ForeignKey("learners.id"), primary_key=True),
        sa.Column("lesson_id", sa.String(length=100), sa.ForeignKey("lessons.id"), primary_key=True),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "mastery",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("learner_id", sa.String(length=100), sa.ForeignKey("learners.id"), nullable=False),
        sa.Column("target_id", sa.String(length=100), nullable=False),
        sa.Column("target_type", sa.String(length=30), nullable=False),
        sa.Column("level", sa.String(length=30), nullable=False),
        sa.Column("score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("confidence", sa.Float(), nullable=False, server_default="0"),
        sa.Column("evidence_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_assessed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="active"),
    )

    op.bulk_insert(
        sa.table(
            "skills",
            sa.column("id", sa.String),
            sa.column("name", sa.String),
            sa.column("description", sa.Text),
            sa.column("version", sa.String),
        ),
        [{"id": "excel", "name": "Excel", "description": "Microsoft Excel skills", "version": "0.1.0"}],
    )
    op.bulk_insert(
        sa.table(
            "topics",
            sa.column("id", sa.String),
            sa.column("skill_id", sa.String),
            sa.column("name", sa.String),
        ),
        [{"id": "lookup-functions", "skill_id": "excel", "name": "Lookup Functions"}],
    )
    op.bulk_insert(
        sa.table(
            "concepts",
            sa.column("id", sa.String),
            sa.column("topic_id", sa.String),
            sa.column("name", sa.String),
        ),
        [{"id": "vlookup", "topic_id": "lookup-functions", "name": "VLOOKUP"}],
    )
    op.bulk_insert(
        sa.table(
            "lessons",
            sa.column("id", sa.String),
            sa.column("concept_id", sa.String),
            sa.column("title", sa.String),
            sa.column("objective", sa.Text),
            sa.column("content", sa.Text),
            sa.column("content_version", sa.String),
        ),
        [{
            "id": "vlookup-basics",
            "concept_id": "vlookup",
            "title": "VLOOKUP Fundamentals",
            "objective": "Use VLOOKUP to retrieve a value from a structured table using an exact match.",
            "content": "VLOOKUP searches for a value in the first column of a table and returns a value from another column in the same row.",
            "content_version": "0.1.0",
        }],
    )
    op.bulk_insert(
        sa.table(
            "exercises",
            sa.column("id", sa.String),
            sa.column("lesson_id", sa.String),
            sa.column("prompt", sa.Text),
            sa.column("expected_answer", sa.Text),
        ),
        [{
            "id": "vlookup-basic-exercise",
            "lesson_id": "vlookup-basics",
            "prompt": "Use VLOOKUP with an exact match to retrieve the value for E102 from A2:D10.",
            "expected_answer": '=VLOOKUP("E102",A2:D10,4,FALSE)',
        }],
    )


def downgrade() -> None:
    op.drop_table("mastery")
    op.drop_table("progress")
    op.drop_table("attempts")
    op.drop_table("exercises")
    op.drop_table("lessons")
    op.drop_table("concepts")
    op.drop_table("topics")
    op.drop_table("skills")
    op.drop_table("learners")
