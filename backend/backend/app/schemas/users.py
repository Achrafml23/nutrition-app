from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import EmailStr
from sqlmodel import Field, SQLModel

from app.models.models import UserBase

from .avatar import AvatarPublic


#### auth
# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional["UserPublic"]


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# auth ############


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    username: str | None = Field(default=None, max_length=255)
    journey_name: str | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)
    username: str | None = None
    journey_name: str | None = None


class UserPublic(UserBase):
    id: UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


class UserPublicWithDetails(UserPublic):
    avatar: Optional["AvatarPublic"] = None


class UserStats(SQLModel):
    level: int
    self_mastery_score: int
    total_habits_completed: int
    total_habits: int
    active_habits: int
    total_completions: int
    current_streak: int
    longest_streak: int
    most_consistent_habit: dict[str, Any]
    analysis_period: dict[str, Any]
