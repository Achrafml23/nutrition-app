import { api } from '@/lib/axios';
import { SavedDay, SavedDayCreate, SavedDaysQueryParams, SavedDaysResponse, SavedDayUpdate } from './days-types';

export const getSavedDays = (params: SavedDaysQueryParams = {}) =>
  api.get<SavedDaysResponse>('/days/', { params }).then((res) => res.data);

export const getSavedDay = (dayId: string) =>
  api.get<SavedDay>(`/days/${dayId}`).then((res) => res.data);

export const createSavedDay = (day: SavedDayCreate) =>
  api.post<SavedDay>('/days/', day).then((res) => res.data);

export const updateSavedDay = (dayId: string, day: SavedDayUpdate) =>
  api.put<SavedDay>(`/days/${dayId}`, day).then((res) => res.data);

export const deleteSavedDay = (dayId: string) =>
  api.delete(`/days/${dayId}`).then((res) => res.data);
