import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models.models import Message
from app.models.nutrition import SavedDay
from app.schemas.nutrition import (
    SavedDayCreate,
    SavedDayPublic,
    SavedDaysPublic,
    SavedDayUpdate,
)

router = APIRouter(prefix="/days", tags=["days"])


@router.get("/", response_model=SavedDaysPublic)
def get_saved_days(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
) -> Any:
    """
    Retrieve saved day plans.
    For now, returns all saved days (user_id is nullable).
    """
    # Build the base query
    statement = select(SavedDay)

    # Apply search filter
    if search:
        search_pattern = f"%{search}%"
        statement = statement.where(
            (SavedDay.title.ilike(search_pattern))
            | (SavedDay.description.ilike(search_pattern))
        )

    # Count total
    count_statement = select(func.count()).select_from(statement.subquery())
    count = session.exec(count_statement).one()

    # Get paginated results
    statement = statement.order_by(SavedDay.updated_at.desc()).offset(skip).limit(limit)
    saved_days = session.exec(statement).all()

    return SavedDaysPublic(data=saved_days, count=count)


@router.get("/{day_id}", response_model=SavedDayPublic)
def get_saved_day(session: SessionDep, day_id: uuid.UUID) -> Any:
    """
    Get saved day plan by ID.
    """
    saved_day = session.get(SavedDay, day_id)
    if not saved_day:
        raise HTTPException(status_code=404, detail="Saved day not found")
    return saved_day


@router.post("/", response_model=SavedDayPublic)
def create_saved_day(*, session: SessionDep, day_in: SavedDayCreate) -> Any:
    """
    Create new saved day plan.
    """
    saved_day = SavedDay.model_validate(day_in)
    session.add(saved_day)
    session.commit()
    session.refresh(saved_day)
    return saved_day


@router.put("/{day_id}", response_model=SavedDayPublic)
def update_saved_day(
    *,
    session: SessionDep,
    day_id: uuid.UUID,
    day_in: SavedDayUpdate,
) -> Any:
    """
    Update a saved day plan.
    """
    saved_day = session.get(SavedDay, day_id)
    if not saved_day:
        raise HTTPException(status_code=404, detail="Saved day not found")

    update_dict = day_in.model_dump(exclude_unset=True)
    saved_day.sqlmodel_update(update_dict)
    session.add(saved_day)
    session.commit()
    session.refresh(saved_day)
    return saved_day


@router.delete("/{day_id}")
def delete_saved_day(session: SessionDep, day_id: uuid.UUID) -> Message:
    """
    Delete a saved day plan.
    """
    saved_day = session.get(SavedDay, day_id)
    if not saved_day:
        raise HTTPException(status_code=404, detail="Saved day not found")

    session.delete(saved_day)
    session.commit()
    return Message(message="Saved day deleted successfully")
