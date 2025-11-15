import uuid

from pydantic import BaseModel
from sqlmodel import (
    SQLModel,
)

from app.models.models import AvatarBase


class AvatarCreate(AvatarBase):
    pass


class AvatarUpdate(AvatarBase):
    symbol: str | None = None  # type: ignore
    description: str | None = None
    image: str | None = None


class AvatarPublic(AvatarBase):
    id: uuid.UUID


class AvatarSelect(BaseModel):
    avatar_id: uuid.UUID


class AvatarsPublic(SQLModel):
    data: list[AvatarPublic] = []
    count: int
