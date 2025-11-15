import enum
import uuid
from datetime import datetime, timezone

from sqlmodel import (
    Field,
    SQLModel,
)


class LifeAreasEnum(str, enum.Enum):
    HEALTH = "HEALTH"
    CAREER = "CAREER"
    RELATIONSHIPS = "RELATIONSHIPS"
    PERSONAL_GROWTH = "PERSONAL_GROWTH"
    FINANCE = "FINANCE"
    RECREATION = "RECREATION"
    ENVIRONMENT = "ENVIRONMENT"
    SPIRITUALITY = "SPIRITUALITY"
    CONTRIBUTION = "CONTRIBUTION"  # Master level - locked initially


class LifeAreaBase(SQLModel):
    name: LifeAreasEnum = Field(unique=True, index=True)
    label: str
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    color_class: str | None = None


class LifeArea(LifeAreaBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    icon: str | None = Field(
        default=None, description="Lucide icon name (e.g., 'heart', 'briefcase')"
    )
    color: str | None = Field(
        default=None, description="Tailwind color class (e.g., 'text-red-500')"
    )
    color_class: str | None = Field(
        default=None, description="Tailwind color class (e.g., 'text-red-500')"
    )
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )
