export interface Category {
  id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  data: Category[];
  count: number;
}

export interface Ingredient {
  id: string;
  category_id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbohydrates_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sodium_per_100g: number;
  measurement_units: string[];
  unit_conversions: Record<string, number>;
  tags: string[];
  default_unit: string;
  typical_serving: number;
  is_traditional: boolean;
  is_halal: boolean;
  created_at: string;
  updated_at: string;
}

export interface IngredientsResponse {
  data: Ingredient[];
  count: number;
}

export interface IngredientCreate {
  category_id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbohydrates_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sodium_per_100g: number;
  measurement_units?: string[];
  unit_conversions?: Record<string, number>;
  tags?: string[];
  default_unit?: string;
  typical_serving?: number;
  is_traditional?: boolean;
  is_halal?: boolean;
}

export interface IngredientsQueryParams {
  skip?: number;
  limit?: number;
  category_id?: string;
  is_traditional?: boolean;
  is_halal?: boolean;
  search?: string;
}
