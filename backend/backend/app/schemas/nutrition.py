import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ===== CATEGORY SCHEMAS =====
class CategoryBase(BaseModel):
    name_fr: str
    name_en: str
    name_ar: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name_fr: Optional[str] = None
    name_en: Optional[str] = None
    name_ar: Optional[str] = None


class CategoryPublic(CategoryBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategoriesPublic(BaseModel):
    data: list[CategoryPublic]
    count: int


# ===== INGREDIENT SCHEMAS =====
class IngredientBase(BaseModel):
    category_id: uuid.UUID
    name_fr: str
    name_en: str
    name_ar: str
    calories_per_100g: float
    protein_per_100g: float
    carbohydrates_per_100g: float
    fat_per_100g: float
    fiber_per_100g: float = 0.0
    sodium_per_100g: float = 0.0
    measurement_units: list[str] = []
    unit_conversions: dict[str, float] = {}
    tags: list[str] = []
    default_unit: str = "g"
    typical_serving: float = 100.0
    is_traditional: bool = False
    is_halal: bool = True


class IngredientCreate(IngredientBase):
    pass


class IngredientUpdate(BaseModel):
    category_id: Optional[uuid.UUID] = None
    name_fr: Optional[str] = None
    name_en: Optional[str] = None
    name_ar: Optional[str] = None
    calories_per_100g: Optional[float] = None
    protein_per_100g: Optional[float] = None
    carbohydrates_per_100g: Optional[float] = None
    fat_per_100g: Optional[float] = None
    fiber_per_100g: Optional[float] = None
    sodium_per_100g: Optional[float] = None
    measurement_units: Optional[list[str]] = None
    unit_conversions: Optional[dict[str, float]] = None
    tags: Optional[list[str]] = None
    default_unit: Optional[str] = None
    typical_serving: Optional[float] = None
    is_traditional: Optional[bool] = None
    is_halal: Optional[bool] = None


class IngredientPublic(IngredientBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class IngredientsPublic(BaseModel):
    data: list[IngredientPublic]
    count: int


# ===== MEAL INGREDIENT SCHEMAS =====
class MealIngredientBase(BaseModel):
    ingredient_id: uuid.UUID
    quantity: float
    unit: str
    calories: float = 0.0
    protein: float = 0.0
    carbohydrates: float = 0.0
    fat: float = 0.0
    fiber: float = 0.0
    sodium: float = 0.0


class MealIngredientCreate(MealIngredientBase):
    pass


class MealIngredientPublic(MealIngredientBase):
    id: uuid.UUID
    meal_id: uuid.UUID
    ingredient: Optional[IngredientPublic] = None

    class Config:
        from_attributes = True


# ===== MEAL SCHEMAS =====
class MealBase(BaseModel):
    name: str
    description: Optional[str] = None
    servings: float = 1.0
    total_calories: float = 0.0
    total_protein: float = 0.0
    total_carbohydrates: float = 0.0
    total_fat: float = 0.0
    total_fiber: float = 0.0
    total_sodium: float = 0.0
    is_favorite: bool = False
    is_traditional: bool = False


class MealCreate(MealBase):
    ingredients: list[MealIngredientCreate] = []


class MealUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    servings: Optional[float] = None
    total_calories: Optional[float] = None
    total_protein: Optional[float] = None
    total_carbohydrates: Optional[float] = None
    total_fat: Optional[float] = None
    total_fiber: Optional[float] = None
    total_sodium: Optional[float] = None
    is_favorite: Optional[bool] = None
    is_traditional: Optional[bool] = None
    ingredients: Optional[list[MealIngredientCreate]] = None


class MealPublic(MealBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
    meal_ingredients: list[MealIngredientPublic] = []

    class Config:
        from_attributes = True


class MealsPublic(BaseModel):
    data: list[MealPublic]
    count: int


# ===== SAVED DAY SCHEMAS =====
class SavedDayBase(BaseModel):
    title: str
    description: Optional[str] = None
    day_plan: dict = {}


class SavedDayCreate(SavedDayBase):
    pass


class SavedDayUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    day_plan: Optional[dict] = None


class SavedDayPublic(SavedDayBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SavedDaysPublic(BaseModel):
    data: list[SavedDayPublic]
    count: int
