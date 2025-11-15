import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import func, select

from app.api.deps import SessionDep
from app.models.models import Message
from app.models.nutrition import Category, Ingredient
from app.schemas.nutrition import (
    CategoryCreate,
    CategoryPublic,
    CategoriesPublic,
    IngredientCreate,
    IngredientPublic,
    IngredientsPublic,
    IngredientUpdate,
)

router = APIRouter(prefix="/ingredients", tags=["ingredients"])


# ===== CATEGORIES =====
@router.get("/categories", response_model=CategoriesPublic)
def get_categories(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve all categories.
    """
    count_statement = select(func.count()).select_from(Category)
    count = session.exec(count_statement).one()
    statement = select(Category).offset(skip).limit(limit)
    categories = session.exec(statement).all()

    return CategoriesPublic(data=categories, count=count)


@router.post("/categories", response_model=CategoryPublic)
def create_category(*, session: SessionDep, category_in: CategoryCreate) -> Any:
    """
    Create new category.
    """
    category = Category.model_validate(category_in)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


# ===== INGREDIENTS =====
@router.get("/", response_model=IngredientsPublic)
def get_ingredients(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100,
    category_id: uuid.UUID | None = None,
    is_traditional: bool | None = None,
    is_halal: bool | None = None,
    search: str | None = None,
) -> Any:
    """
    Retrieve ingredients with optional filters.
    """
    # Build the base query
    statement = select(Ingredient)

    # Apply filters
    if category_id:
        statement = statement.where(Ingredient.category_id == category_id)
    if is_traditional is not None:
        statement = statement.where(Ingredient.is_traditional == is_traditional)
    if is_halal is not None:
        statement = statement.where(Ingredient.is_halal == is_halal)
    if search:
        search_pattern = f"%{search}%"
        statement = statement.where(
            (Ingredient.name_en.ilike(search_pattern))
            | (Ingredient.name_fr.ilike(search_pattern))
            | (Ingredient.name_ar.ilike(search_pattern))
        )

    # Count total
    count_statement = select(func.count()).select_from(statement.subquery())
    count = session.exec(count_statement).one()

    # Get paginated results
    statement = statement.offset(skip).limit(limit)
    ingredients = session.exec(statement).all()

    return IngredientsPublic(data=ingredients, count=count)


@router.get("/{ingredient_id}", response_model=IngredientPublic)
def get_ingredient(session: SessionDep, ingredient_id: uuid.UUID) -> Any:
    """
    Get ingredient by ID.
    """
    ingredient = session.get(Ingredient, ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredient


@router.post("/", response_model=IngredientPublic)
def create_ingredient(*, session: SessionDep, ingredient_in: IngredientCreate) -> Any:
    """
    Create new ingredient.
    """
    # Verify category exists
    category = session.get(Category, ingredient_in.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    ingredient = Ingredient.model_validate(ingredient_in)
    session.add(ingredient)
    session.commit()
    session.refresh(ingredient)
    return ingredient


@router.put("/{ingredient_id}", response_model=IngredientPublic)
def update_ingredient(
    *,
    session: SessionDep,
    ingredient_id: uuid.UUID,
    ingredient_in: IngredientUpdate,
) -> Any:
    """
    Update an ingredient.
    """
    ingredient = session.get(Ingredient, ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    # If category is being updated, verify it exists
    if ingredient_in.category_id:
        category = session.get(Category, ingredient_in.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

    update_dict = ingredient_in.model_dump(exclude_unset=True)
    ingredient.sqlmodel_update(update_dict)
    session.add(ingredient)
    session.commit()
    session.refresh(ingredient)
    return ingredient


@router.delete("/{ingredient_id}")
def delete_ingredient(session: SessionDep, ingredient_id: uuid.UUID) -> Message:
    """
    Delete an ingredient.
    """
    ingredient = session.get(Ingredient, ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    session.delete(ingredient)
    session.commit()
    return Message(message="Ingredient deleted successfully")
