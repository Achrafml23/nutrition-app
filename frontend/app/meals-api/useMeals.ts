import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './meals-api';
import { Meal, MealCreate, MealsQueryParams, MealsResponse, MealUpdate } from './meals-types';

// Fetch all meals
export function useMeals(params: MealsQueryParams = {}) {
  return useQuery<MealsResponse>({
    queryKey: ['meals', params],
    queryFn: () => api.getMeals(params),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// Fetch single meal
export function useMeal(mealId: string) {
  return useQuery<Meal>({
    queryKey: ['meal', mealId],
    queryFn: () => api.getMeal(mealId),
    enabled: !!mealId,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// Create meal
export function useCreateMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (meal: MealCreate) => api.createMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

// Update meal
export function useUpdateMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MealUpdate }) => api.updateMeal(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meal', data.id] });
    },
  });
}

// Delete meal
export function useDeleteMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mealId: string) => api.deleteMeal(mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

// Toggle meal favorite
export function useToggleMealFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_favorite }: { id: string; is_favorite: boolean }) =>
      api.toggleMealFavorite(id, is_favorite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meal', data.id] });
    },
  });
}
