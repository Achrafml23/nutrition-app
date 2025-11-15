export interface SavedDay {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  day_plan: any; // JSON object
  created_at: string;
  updated_at: string;
}

export interface SavedDayCreate {
  title: string;
  description?: string;
  day_plan: any;
}

export interface SavedDayUpdate {
  title?: string;
  description?: string;
  day_plan?: any;
}

export interface SavedDaysResponse {
  data: SavedDay[];
  count: number;
}

export interface SavedDaysQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
}
