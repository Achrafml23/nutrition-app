export interface Category {
  id: string
  name_fr: string
  name_en: string
  name_ar: string
}

export interface Ingredient {
  id: string
  category_id: string
  name_fr: string
  name_en: string
  name_ar: string
  calories_per_100g: number
  protein_per_100g: number
  carbohydrates_per_100g: number
  fat_per_100g: number
  fiber_per_100g: number
  sodium_per_100g: number
  measurement_units: string[]
  default_unit: string
  typical_serving: number
  unit_conversions: Record<string, number>
  tags: string[]
  is_traditional: boolean
  is_halal: boolean
}

export interface MealCategory {
  id: string
  name_fr: string
  name_en: string
  name_ar: string
  icon: string
  typical_time: string
  color: string
}

export interface MealIngredient {
  id: string
  ingredient: Ingredient
  quantity: number
  unit: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  sodium: number
}

export interface Meal {
  id?: string
  name: string
  description?: string
  ingredients: MealIngredient[]
  total_calories: number
  total_protein: number
  total_carbohydrates: number
  total_fat: number
  total_fiber: number
  total_sodium: number
  servings: number
  is_favorite: boolean
  is_traditional: boolean
}

export interface MealPlanItem {
  id: string
  type: "meal" | "ingredient"
  meal?: Meal
  ingredient?: Ingredient
  consumption_amount: number // grams for ingredients, servings or grams for meals
  consumption_unit?: "servings" | "grams" // Added unit tracking for meals
  consumption_percentage: number
  actual_calories: number
  actual_protein: number
  actual_carbohydrates: number
  actual_fat: number
  actual_fiber: number
  actual_sodium: number
}

export interface DailyPlan {
  id?: string
  user_id?: string
  plan_date: string
  meals: {
    breakfast?: MealPlanItem[]
    lunch?: MealPlanItem[]
    dinner?: MealPlanItem[]
    snacks?: MealPlanItem[]
  }
  total_calories: number
  total_protein: number
  total_carbohydrates: number
  total_fat: number
  total_fiber: number
  total_sodium: number
}

export interface WeeklyPlan {
  id?: string
  user_id?: string
  week_start: string
  daily_plans: DailyPlan[]
}

export interface NutritionGoals {
  daily_calories: number
  protein_percentage: number
  carbs_percentage: number
  fat_percentage: number
  fiber_grams: number
  sodium_mg: number
}

export interface DashboardStats {
  todayCalories: number
  calorieGoal: number
  weeklyAverage: number
  mealsPlanned: number
  favoriteMeals: number
  traditionalMealsCount: number
}

export interface UserProfile {
  id?: string
  user_id?: string
  name?: string
  preferred_language: "ar" | "fr" | "en"
  daily_calories: number
  protein_percentage: number
  carbs_percentage: number
  fat_percentage: number
  fiber_grams: number
  sodium_mg: number
  dietary_restrictions: string[]
  preferred_region?: string
}

export interface MealTypeSuggestion {
  name_en: string
  name_fr: string
  name_ar: string
  color: string
  typical_time: string
  icon: string
}

export interface DayMealItem {
  id: string
  type: "meal" | "ingredient"
  meal?: Meal
  meal_id?: string
  ingredient?: Ingredient
  ingredient_id?: string
  quantity: number
  unit: string
}

export interface DayMeal {
  id: string
  name: string
  time?: string
  color: string
  items: DayMealItem[]
  notes?: string
}

export interface DayPlan {
  date: string
  day_meals: DayMeal[]
  total_nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sodium: number
  }
  daily_goals: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sodium: number
  }
}

export interface Day {
  id: string
  title: string
  description?: string
  day_plan: DayPlan
  created_at: string
  updated_at: string
}
