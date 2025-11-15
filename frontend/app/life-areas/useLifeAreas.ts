// import { useQuery } from '@tanstack/react-query';
// import * as api from './life-areas-api';
// import { LifeAreasResponse, LifeAreasStatsResponse } from './life-areas-types';

// // Fetch all habits
// export function useLifeAreas() {
//   return useQuery<LifeAreasResponse>({
//     queryKey: ['life-areas'],
//     queryFn: () => api.getLifeAreas(),
//     staleTime: 1000 * 60 * 5, // 5 min
//   });
// }

// export function useLifeAreasStats() {
//   return useQuery<LifeAreasStatsResponse>({
//     queryKey: ['life-areas-stats'],
//     queryFn: () => api.getLifeAreasStats(),
//     staleTime: 1000 * 60 * 60, // 60 min
//   });
// }
