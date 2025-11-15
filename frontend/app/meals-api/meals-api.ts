import { api } from '@/lib/axios';
import { Meal, MealCreate, MealsQueryParams, MealsResponse, MealUpdate } from './meals-types';

export const getMeals = (params: MealsQueryParams = {}) =>
  api.get<MealsResponse>('/meals/', { params }).then((res) => res.data);

export const getMeal = (mealId: string) =>
  api.get<Meal>(`/meals/${mealId}`).then((res) => res.data);

export const createMeal = (meal: MealCreate) =>
  api.post<Meal>('/meals/', meal).then((res) => res.data);

export const updateMeal = (mealId: string, meal: MealUpdate) =>
  api.put<Meal>(`/meals/${mealId}`, meal).then((res) => res.data);

export const deleteMeal = (mealId: string) =>
  api.delete(`/meals/${mealId}`).then((res) => res.data);

export const toggleMealFavorite = (mealId: string, is_favorite: boolean) =>
  api.patch<Meal>(`/meals/${mealId}/favorite`, null, { params: { is_favorite } }).then((res) => res.data);
