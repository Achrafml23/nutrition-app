import { Ingredient } from '../ingredients/ingredients-types';

export interface MealIngredient {
  id: string;
  meal_id: string;
  ingredient_id: string;
  ingredient?: Ingredient;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface MealIngredientCreate {
  ingredient_id: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface Meal {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  servings: number;
  total_calories: number;
  total_protein: number;
  total_carbohydrates: number;
  total_fat: number;
  total_fiber: number;
  total_sodium: number;
  is_favorite: boolean;
  is_traditional: boolean;
  created_at: string;
  updated_at: string;
  meal_ingredients: MealIngredient[];
}

export interface MealCreate {
  name: string;
  description?: string;
  servings: number;
  total_calories: number;
  total_protein: number;
  total_carbohydrates: number;
  total_fat: number;
  total_fiber: number;
  total_sodium: number;
  is_favorite?: boolean;
  is_traditional?: boolean;
  ingredients: MealIngredientCreate[];
}

export interface MealUpdate {
  name?: string;
  description?: string;
  servings?: number;
  total_calories?: number;
  total_protein?: number;
  total_carbohydrates?: number;
  total_fat?: number;
  total_fiber?: number;
  total_sodium?: number;
  is_favorite?: boolean;
  is_traditional?: boolean;
  ingredients?: MealIngredientCreate[];
}

export interface MealsResponse {
  data: Meal[];
  count: number;
}

export interface MealsQueryParams {
  skip?: number;
  limit?: number;
  is_favorite?: boolean;
  is_traditional?: boolean;
  search?: string;
}
