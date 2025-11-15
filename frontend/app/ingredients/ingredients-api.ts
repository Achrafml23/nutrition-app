import { api } from '@/lib/axios';
import {
  CategoriesResponse,
  Ingredient,
  IngredientCreate,
  IngredientsQueryParams,
  IngredientsResponse,
} from './ingredients-types';

// Categories
export const getCategories = (skip: number = 0, limit: number = 100) =>
  api.get<CategoriesResponse>('/ingredients/categories', { params: { skip, limit } }).then((res) => res.data);

// Ingredients
export const getIngredients = (params: IngredientsQueryParams = {}) =>
  api.get<IngredientsResponse>('/ingredients/', { params }).then((res) => res.data);

export const getIngredient = (ingredientId: string) =>
  api.get<Ingredient>(`/ingredients/${ingredientId}`).then((res) => res.data);

export const createIngredient = (ingredient: IngredientCreate) =>
  api.post<Ingredient>('/ingredients/', ingredient).then((res) => res.data);

export const updateIngredient = (ingredientId: string, ingredient: Partial<IngredientCreate>) =>
  api.put<Ingredient>(`/ingredients/${ingredientId}`, ingredient).then((res) => res.data);

export const deleteIngredient = (ingredientId: string) =>
  api.delete(`/ingredients/${ingredientId}`).then((res) => res.data);
