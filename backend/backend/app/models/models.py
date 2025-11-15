# ! TODO: Add enums whenever needed!
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import (
    Field,
    Relationship,
    SQLModel,
)

from app.models.life_areas import LifeArea  # noqa
from app.models.wheel_of_life import (  # noqa
    AreaAssessment,
    AssessmentQuestion,
    AssessmentQuestionOption,
    InDepthAssessmentVersion,
    UserAnswer,
    UserAnswerOption,
    WheelAssessment,
)


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: Optional["User"] | None = Relationship(back_populates="items")
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )


class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic] = []
    count: int


# Generic message
class Message(SQLModel):
    message: str


# Avatar Schemas
class AvatarBase(SQLModel):
    symbol: str
    description: str | None = None
    image: str | None = None


class Avatar(AvatarBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    users: Optional["User"] = Relationship(back_populates="avatar")


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    username: str | None = Field(default=None, max_length=255)
    journey_name: str | None = Field(default=None, max_length=255)


class User(UserBase, table=True):  # type: ignore
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    avatar_id: uuid.UUID | None = Field(
        default=None, foreign_key="avatar.id", nullable=True
    )
    avatar: Avatar | None = Relationship(back_populates="users")
    reset_hour_utc: int = Field(default=0, ge=0, le=23, index=True)

    # User stats fields currently habits based
    total_habits_completed: int = Field(default=0, index=True)
    self_mastery_score: int = Field(default=0, index=True)
    level: int = Field(default=1)
    refresh_tokens: Optional["RefreshToken"] = Relationship(
        back_populates="user", cascade_delete=True
    )

    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    token: str = Field(nullable=False)  # raw token or jti
    is_active: bool = Field(default=True)
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    expires_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=7)
    )

    user: User = Relationship(back_populates="refresh_tokens")
