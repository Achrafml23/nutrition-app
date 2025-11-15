import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './ingredients-api';
import {
  CategoriesResponse,
  Ingredient,
  IngredientCreate,
  IngredientsQueryParams,
  IngredientsResponse,
} from './ingredients-types';

// Fetch all categories
export function useCategories() {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 min
  });
}

// Fetch all ingredients
export function useIngredients(params: IngredientsQueryParams = {}) {
  return useQuery<IngredientsResponse>({
    queryKey: ['ingredients', params],
    queryFn: () => api.getIngredients(params),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// Fetch single ingredient
export function useIngredient(ingredientId: string) {
  return useQuery<Ingredient>({
    queryKey: ['ingredient', ingredientId],
    queryFn: () => api.getIngredient(ingredientId),
    enabled: !!ingredientId,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// Create ingredient
export function useCreateIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredient: IngredientCreate) => api.createIngredient(ingredient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

// Update ingredient
export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IngredientCreate> }) =>
      api.updateIngredient(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['ingredient', data.id] });
    },
  });
}

// Delete ingredient
export function useDeleteIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ingredientId: string) => api.deleteIngredient(ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}
