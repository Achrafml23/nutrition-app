import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, Relationship, SQLModel


# ===== CATEGORY MODEL =====
class CategoryBase(SQLModel):
    name_fr: str = Field(max_length=255)
    name_en: str = Field(max_length=255)
    name_ar: str = Field(max_length=255)


class Category(CategoryBase, table=True):
    __tablename__ = "categories"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )

    # Relationships
    ingredients: list["Ingredient"] = Relationship(back_populates="category")


# ===== INGREDIENT MODEL =====
class IngredientBase(SQLModel):
    category_id: uuid.UUID = Field(foreign_key="categories.id")
    name_fr: str = Field(max_length=255)
    name_en: str = Field(max_length=255)
    name_ar: str = Field(max_length=255)
    calories_per_100g: float
    protein_per_100g: float
    carbohydrates_per_100g: float
    fat_per_100g: float
    fiber_per_100g: float = Field(default=0.0)
    sodium_per_100g: float = Field(default=0.0)
    default_unit: str = Field(default="g", max_length=50)
    typical_serving: float = Field(default=100.0)
    is_traditional: bool = Field(default=False)
    is_halal: bool = Field(default=True)


class Ingredient(IngredientBase, table=True):
    __tablename__ = "ingredients"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    measurement_units: list[str] = Field(default=[], sa_column=Column(JSON))
    unit_conversions: dict[str, float] = Field(default={}, sa_column=Column(JSON))
    tags: list[str] = Field(default=[], sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )

    # Relationships
    category: Optional[Category] = Relationship(back_populates="ingredients")
    meal_ingredients: list["MealIngredient"] = Relationship(back_populates="ingredient")


# ===== MEAL MODEL =====
class MealBase(SQLModel):
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    servings: float = Field(default=1.0)
    total_calories: float = Field(default=0.0)
    total_protein: float = Field(default=0.0)
    total_carbohydrates: float = Field(default=0.0)
    total_fat: float = Field(default=0.0)
    total_fiber: float = Field(default=0.0)
    total_sodium: float = Field(default=0.0)
    is_favorite: bool = Field(default=False)
    is_traditional: bool = Field(default=False)


class Meal(MealBase, table=True):
    __tablename__ = "meals"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id", nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )

    # Relationships
    user: Optional["User"] = Relationship(back_populates="meals")
    meal_ingredients: list["MealIngredient"] = Relationship(
        back_populates="meal",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


# ===== MEAL INGREDIENT (Junction Table) =====
class MealIngredientBase(SQLModel):
    meal_id: uuid.UUID = Field(foreign_key="meals.id")
    ingredient_id: uuid.UUID = Field(foreign_key="ingredients.id")
    quantity: float
    unit: str = Field(max_length=50)
    calories: float = Field(default=0.0)
    protein: float = Field(default=0.0)
    carbohydrates: float = Field(default=0.0)
    fat: float = Field(default=0.0)
    fiber: float = Field(default=0.0)
    sodium: float = Field(default=0.0)


class MealIngredient(MealIngredientBase, table=True):
    __tablename__ = "meal_ingredients"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    meal: Optional[Meal] = Relationship(back_populates="meal_ingredients")
    ingredient: Optional[Ingredient] = Relationship(back_populates="meal_ingredients")


# ===== SAVED DAY MODEL =====
class SavedDayBase(SQLModel):
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)


class SavedDay(SavedDayBase, table=True):
    __tablename__ = "saved_days"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id", nullable=True)
    day_plan: dict = Field(default={}, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )

    # Relationships
    user: Optional["User"] = Relationship(back_populates="saved_days")


# Update User model to include nutrition relationships
# This will be imported in models.py to add the relationships
