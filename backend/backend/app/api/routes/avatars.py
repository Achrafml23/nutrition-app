import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models.models import (
    Avatar,
    Message,
)
from app.schemas.avatar import (
    AvatarCreate,
    AvatarPublic,
    AvatarsPublic,
    AvatarUpdate,
)

router = APIRouter(prefix="/avatars", tags=["avatars"])


@router.get("/", response_model=AvatarsPublic)
def read_avatars(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve avatars.
    """

    count_statement = select(func.count()).select_from(Avatar)
    count = session.exec(count_statement).one()
    statement = select(Avatar).offset(skip).limit(limit)
    avatars = session.exec(statement).all()

    return AvatarsPublic(data=avatars, count=count)


@router.get("/{id}", response_model=AvatarPublic)
def read_avatar(session: SessionDep, id: uuid.UUID) -> Any:
    """
    Get avatar by ID.
    """
    avatar = session.get(Avatar, id)
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    return avatar


@router.post("/", response_model=AvatarPublic)
def create_avatar(
    *, session: SessionDep, current_user: CurrentUser, avatar_in: AvatarCreate
) -> Any:
    """
    Create new avatar.
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    avatar = Avatar.model_validate(avatar_in)
    session.add(avatar)
    session.commit()
    session.refresh(avatar)
    return avatar


@router.put("/{id}", response_model=AvatarPublic)
def update_avatar(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    avatar_in: AvatarUpdate,
) -> Any:
    """
    Update an avatar.
    """
    avatar = session.get(Avatar, id)
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = avatar_in.model_dump(exclude_unset=True)
    avatar.sqlmodel_update(update_dict)
    session.add(avatar)
    session.commit()
    session.refresh(avatar)
    return avatar


@router.delete("/{id}")
def delete_avatar(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an avatar.
    """
    avatar = session.get(Avatar, id)
    if not avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(avatar)
    session.commit()
    return Message(message="Avatar deleted successfully")


@router.get("/more_avatars", response_model=list[dict])
def get_available_avatars() -> Any:
    """
    Get all available avatars that users can choose from
    """
    # TODO: Move this to a database table or config file
    avatars = [
        {
            "id": "phoenix",
            "symbol": "🔥",
            "name": "Phoenix",
            "image": "/avatars/phoenix.svg",
            "description": "Rise from the ashes of your past self",
            "philosophy": "Transformation through consistent renewal. Every habit is a chance to reinvent yourself.",
            "category": "transformation",
        },
        {
            "id": "mountain",
            "symbol": "⛰️",
            "name": "Mountain",
            "image": "/avatars/mountain.svg",
            "description": "Steady, unwavering, reaching new heights",
            "philosophy": "Growth through persistence. Like a mountain, build your habits one layer at a time.",
            "category": "persistence",
        },
        {
            "id": "ocean",
            "symbol": "🌊",
            "name": "Ocean",
            "image": "/avatars/ocean.svg",
            "description": "Fluid, adaptable, powerful in consistency",
            "philosophy": "Flow with life while maintaining your core habits. Adaptability with consistency.",
            "category": "flow",
        },
        {
            "id": "tree",
            "symbol": "🌳",
            "name": "Ancient Tree",
            "image": "/avatars/tree.svg",
            "description": "Deep roots, steady growth, lasting impact",
            "philosophy": "Sustainable growth through deep-rooted habits. Build a foundation that lasts.",
            "category": "sustainability",
        },
        {
            "id": "star",
            "symbol": "⭐",
            "name": "Guiding Star",
            "image": "/avatars/star.svg",
            "description": "Illuminating the path forward",
            "philosophy": "Be a beacon for others. Your consistent habits light the way.",
            "category": "leadership",
        },
        {
            "id": "lotus",
            "symbol": "🪷",
            "name": "Lotus",
            "image": "/avatars/lotus.svg",
            "description": "Beauty emerging from struggle",
            "philosophy": "Find peace and growth in daily practice. Rise above challenges with grace.",
            "category": "mindfulness",
        },
    ]
    return avatars
