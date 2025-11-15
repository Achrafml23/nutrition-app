import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models.models import Message
from app.models.nutrition import Ingredient, Meal, MealIngredient
from app.schemas.nutrition import (
    MealCreate,
    MealPublic,
    MealsPublic,
    MealUpdate,
)

router = APIRouter(prefix="/meals", tags=["meals"])


@router.get("/", response_model=MealsPublic)
def get_meals(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    is_favorite: bool | None = None,
    is_traditional: bool | None = None,
    search: str | None = None,
) -> Any:
    """
    Retrieve meals with optional filters.
    For now, returns all meals (user_id is nullable).
    """
    # Build the base query with eager loading of ingredients
    statement = select(Meal).options(
        selectinload(Meal.meal_ingredients).selectinload(MealIngredient.ingredient)
    )

    # Apply filters
    if is_favorite is not None:
        statement = statement.where(Meal.is_favorite == is_favorite)
    if is_traditional is not None:
        statement = statement.where(Meal.is_traditional == is_traditional)
    if search:
        search_pattern = f"%{search}%"
        statement = statement.where(
            (Meal.name.ilike(search_pattern))
            | (Meal.description.ilike(search_pattern))
        )

    # Count total
    count_statement = select(func.count()).select_from(statement.subquery())
    count = session.exec(count_statement).one()

    # Get paginated results
    statement = statement.order_by(Meal.created_at.desc()).offset(skip).limit(limit)
    meals = session.exec(statement).all()

    return MealsPublic(data=meals, count=count)


@router.get("/{meal_id}", response_model=MealPublic)
def get_meal(session: SessionDep, meal_id: uuid.UUID) -> Any:
    """
    Get meal by ID with all ingredients.
    """
    statement = select(Meal).where(Meal.id == meal_id).options(
        selectinload(Meal.meal_ingredients).selectinload(MealIngredient.ingredient)
    )
    meal = session.exec(statement).first()

    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    return meal


@router.post("/", response_model=MealPublic)
def create_meal(*, session: SessionDep, meal_in: MealCreate) -> Any:
    """
    Create new meal with ingredients.
    """
    # Verify all ingredients exist
    for ingredient_data in meal_in.ingredients:
        ingredient = session.get(Ingredient, ingredient_data.ingredient_id)
        if not ingredient:
            raise HTTPException(
                status_code=404,
                detail=f"Ingredient {ingredient_data.ingredient_id} not found",
            )

    # Create the meal (without ingredients first)
    meal_dict = meal_in.model_dump(exclude={"ingredients"})
    meal = Meal.model_validate(meal_dict)
    session.add(meal)
    session.flush()  # Get the meal ID

    # Create meal ingredients
    for ingredient_data in meal_in.ingredients:
        meal_ingredient = MealIngredient(
            meal_id=meal.id,
            **ingredient_data.model_dump()
        )
        session.add(meal_ingredient)

    session.commit()

    # Refresh and load relationships
    session.refresh(meal)
    statement = select(Meal).where(Meal.id == meal.id).options(
        selectinload(Meal.meal_ingredients).selectinload(MealIngredient.ingredient)
    )
    meal = session.exec(statement).first()

    return meal


@router.put("/{meal_id}", response_model=MealPublic)
def update_meal(
    *,
    session: SessionDep,
    meal_id: uuid.UUID,
    meal_in: MealUpdate,
) -> Any:
    """
    Update a meal.
    """
    meal = session.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    # Update meal properties
    update_dict = meal_in.model_dump(exclude_unset=True, exclude={"ingredients"})
    meal.sqlmodel_update(update_dict)

    # If ingredients are being updated, delete old ones and create new ones
    if meal_in.ingredients is not None:
        # Verify all ingredients exist
        for ingredient_data in meal_in.ingredients:
            ingredient = session.get(Ingredient, ingredient_data.ingredient_id)
            if not ingredient:
                raise HTTPException(
                    status_code=404,
                    detail=f"Ingredient {ingredient_data.ingredient_id} not found",
                )

        # Delete existing meal ingredients
        statement = select(MealIngredient).where(MealIngredient.meal_id == meal_id)
        existing_meal_ingredients = session.exec(statement).all()
        for meal_ingredient in existing_meal_ingredients:
            session.delete(meal_ingredient)

        # Create new meal ingredients
        for ingredient_data in meal_in.ingredients:
            meal_ingredient = MealIngredient(
                meal_id=meal.id,
                **ingredient_data.model_dump()
            )
            session.add(meal_ingredient)

    session.add(meal)
    session.commit()

    # Refresh and load relationships
    statement = select(Meal).where(Meal.id == meal_id).options(
        selectinload(Meal.meal_ingredients).selectinload(MealIngredient.ingredient)
    )
    meal = session.exec(statement).first()

    return meal


@router.delete("/{meal_id}")
def delete_meal(session: SessionDep, meal_id: uuid.UUID) -> Message:
    """
    Delete a meal.
    """
    meal = session.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    session.delete(meal)
    session.commit()
    return Message(message="Meal deleted successfully")


@router.patch("/{meal_id}/favorite")
def toggle_meal_favorite(
    session: SessionDep, meal_id: uuid.UUID, is_favorite: bool
) -> MealPublic:
    """
    Toggle meal favorite status.
    """
    meal = session.get(Meal, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    meal.is_favorite = is_favorite
    session.add(meal)
    session.commit()
    session.refresh(meal)

    return meal
