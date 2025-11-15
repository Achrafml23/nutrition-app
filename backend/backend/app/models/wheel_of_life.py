import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import UUID

from sqlmodel import (
    Field,
    Relationship,
    SQLModel,
)


###############################################################
##################### AssessmentBase ##########################
###############################################################
class AssessmentType(str, Enum):
    QUICK = "quick"
    DETAILED = "detailed"


class WheelAssessment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    type: AssessmentType
    version: int = Field(default=1)
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )


class AreaAssessment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    wheel_assessment_id: UUID = Field(foreign_key="wheelassessment.id")
    lifearea_id: UUID = Field(foreign_key="lifearea.id")
    score: float
    is_quick: bool = Field(default=False)
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )


class InDepthAssessmentVersionBase(SQLModel):
    version: int
    title: str
    description: str | None = None
    instructions: str | None = None


class InDepthAssessmentVersion(InDepthAssessmentVersionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    lifearea_id: UUID = Field(foreign_key="lifearea.id")

    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )


class InDepthAssessmentCreate(InDepthAssessmentVersionBase):
    lifearea_id: UUID


class InDepthAssessmentUpdate(InDepthAssessmentVersionBase):
    lifearea_id: UUID | None = None


class InDepthAssessmentPublic(InDepthAssessmentVersionBase):
    id: uuid.UUID


class InDepthAssessmentsPublic(SQLModel):
    data: list[InDepthAssessmentPublic] = []
    count: int


class InDepthAssessmentPublicWithDetails(InDepthAssessmentPublic):
    lifeArea: Optional["LifeAreaPublic"] = None  # noqa


class QuestionType(str, Enum):
    SCALE = "scale"  # e.g. 1–10
    MULTIPLE_CHOICE = "multiple_choice"
    TEXT = "text"


class AssessmentQuestionBase(SQLModel):
    text: str
    order: int
    type: QuestionType = Field(default=QuestionType.SCALE)
    instructions: str | None = None


class AssessmentQuestion(AssessmentQuestionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    assessment_version_id: UUID = Field(foreign_key="indepthassessmentversion.id")
    options: list["AssessmentQuestionOption"] = Relationship(back_populates="question")
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )


class AssessmentQuestionOption(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    question_id: UUID = Field(foreign_key="assessmentquestion.id")
    text: str
    value: float
    order: int
    question: Optional["AssessmentQuestion"] = Relationship(back_populates="options")
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class AssessmentQuestionCreate(AssessmentQuestionBase):
    assessment_version_id: UUID
    options: list["AssessmentQuestionOption"] = []


class AssessmentQuestionUpdate(AssessmentQuestionBase):
    # ! TODO: add pydantic verification
    text: str | None = None  # type: ignore
    instructions: str | None = None
    order: int | None = None  # type: ignore
    assessment_version_id: UUID
    type: QuestionType = Field(default=QuestionType.SCALE)
    options: list["AssessmentQuestionOption"] = []


class AssessmentQuestionPublic(AssessmentQuestionBase):
    id: uuid.UUID
    options: list["AssessmentQuestionOption"] = []


class AssessmentQuestionsPublic(SQLModel):
    data: list[AssessmentQuestionPublic] = []
    count: int


class UserAnswerOption(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_answer_id: UUID = Field(foreign_key="useranswer.id")
    option_id: UUID = Field(foreign_key="assessmentquestionoption.id")
    answer: Optional["UserAnswer"] = Relationship(back_populates="options")
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class UserAnswer(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    question_id: UUID = Field(foreign_key="assessmentquestion.id")

    answer_value: float | None = None  # for scale questions
    answer_text: str | None = None  # for open text questions
    created_at: datetime = Field(default_factory=datetime.utcnow)
    options: list["UserAnswerOption"] = Relationship(back_populates="answer")
