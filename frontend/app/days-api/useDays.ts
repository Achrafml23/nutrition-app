import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './days-api';
import { SavedDay, SavedDayCreate, SavedDaysQueryParams, SavedDaysResponse, SavedDayUpdate } from './days-types';

// Fetch all saved days
export function useSavedDays(params: SavedDaysQueryParams = {}) {
  return useQuery<SavedDaysResponse>({
    queryKey: ['saved-days', params],
    queryFn: () => api.getSavedDays(params),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// Fetch single saved day
export function useSavedDay(dayId: string) {
  return useQuery<SavedDay>({
    queryKey: ['saved-day', dayId],
    queryFn: () => api.getSavedDay(dayId),
    enabled: !!dayId,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// Create saved day
export function useCreateSavedDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (day: SavedDayCreate) => api.createSavedDay(day),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-days'] });
    },
  });
}

// Update saved day
export function useUpdateSavedDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SavedDayUpdate }) => api.updateSavedDay(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['saved-days'] });
      queryClient.invalidateQueries({ queryKey: ['saved-day', data.id] });
    },
  });
}

// Delete saved day
export function useDeleteSavedDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dayId: string) => api.deleteSavedDay(dayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-days'] });
    },
  });
}
