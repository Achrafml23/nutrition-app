# backend/app/models/trackable.py
from datetime import datetime
from uuid import UUID

from sqlmodel import SQLModel

from app.models.trackables import (
    TrackableBase,
    TrackableEntryBase,
    TrackableGroupBase,
    TrackableOptionBase,
    TrackableType,
    TrackableUnit,
)
from app.schemas.life_areas import LifeAreaPublic


# API Schemas
class TrackableOptionCreate(TrackableOptionBase):
    pass


class TrackableOptionPublic(TrackableOptionBase):
    id: UUID


class TrackableGroupCreate(TrackableGroupBase):
    pass


class TrackableGroupUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    color: str | None = None
    icon: str | None = None
    is_active: bool | None = None


class TrackableGroupPublic(TrackableGroupBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime


class TrackableCreate(TrackableBase):
    group_id: UUID | None = None
    lifearea_id: UUID | None = None
    options: list[TrackableOptionCreate] | None = None


class TrackableUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    type: TrackableType | None = None
    unit: TrackableUnit | None = None
    color: str | None = None
    icon: str | None = None
    goal: float | None = None
    is_active: bool | None = None
    group_id: UUID | None = None
    lifearea_id: UUID | None = None
    options: list[TrackableOptionCreate] | None = None


class TrackablePublic(TrackableBase):
    id: UUID
    user_id: UUID
    group_id: UUID | None = None
    lifearea_id: UUID | None = None
    lifeArea: LifeAreaPublic | None = None
    created_at: datetime
    updated_at: datetime


class TrackableWithRelations(TrackablePublic):
    group: TrackableGroupPublic | None = None
    options: list[TrackableOptionPublic] = []
    entries: list["TrackableEntryPublic"] = []


class TrackableEntryCreate(SQLModel):
    value_numeric: float | None = None
    value_text: str | None = None
    value_boolean: bool | None = None
    entry_date: datetime | None = None
    notes: str | None = None


class TrackableEntryUpdate(SQLModel):
    value_numeric: float | None = None
    value_text: str | None = None
    value_boolean: bool | None = None
    entry_date: datetime | None = None
    notes: str | None = None


class TrackableEntryPublic(TrackableEntryBase):
    id: UUID
    trackable_id: UUID
    created_at: datetime
    updated_at: datetime


# Response models
class TrackablesPublic(SQLModel):
    data: list[TrackableWithRelations]
    count: int


class TrackableGroupsPublic(SQLModel):
    data: list[TrackableGroupPublic]
    count: int


class TrackableEntriesPublic(SQLModel):
    data: list[TrackableEntryPublic]
    count: int
