import type { DailyPlan, NutritionGoals } from "@/lib/types/nutrition"

export function calculateDailyPlanTotals(
  dailyPlan: DailyPlan,
): Omit<DailyPlan, "id" | "user_id" | "plan_date" | "meals"> {
  const allMeals = [
    ...(dailyPlan.meals.ftour || []),
    ...(dailyPlan.meals.ghada || []),
    ...(dailyPlan.meals.asha || []),
    ...(dailyPlan.meals.gouter || []),
  ]

  return allMeals.reduce(
    (totals, meal) => ({
      total_calories: Math.round((totals.total_calories + meal.total_calories) * 100) / 100,
      total_protein: Math.round((totals.total_protein + meal.total_protein) * 100) / 100,
      total_carbohydrates: Math.round((totals.total_carbohydrates + meal.total_carbohydrates) * 100) / 100,
      total_fat: Math.round((totals.total_fat + meal.total_fat) * 100) / 100,
      total_fiber: Math.round((totals.total_fiber + meal.total_fiber) * 100) / 100,
      total_sodium: Math.round((totals.total_sodium + meal.total_sodium) * 100) / 100,
    }),
    {
      total_calories: 0,
      total_protein: 0,
      total_carbohydrates: 0,
      total_fat: 0,
      total_fiber: 0,
      total_sodium: 0,
    },
  )
}

export function calculateGoalProgress(actual: number, goal: number): number {
  return goal > 0 ? Math.round((actual / goal) * 100) : 0
}

export function getWeekDates(weekStart: string): string[] {
  const start = new Date(weekStart)
  const dates = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    dates.push(date.toISOString().split("T")[0])
  }

  return dates
}

export function formatDate(dateString: string, locale = "fr"): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  return date.toLocaleDateString(locale, options)
}

export function getDefaultNutritionGoals(): NutritionGoals {
  return {
    daily_calories: 2000,
    protein_percentage: 20,
    carbs_percentage: 50,
    fat_percentage: 30,
    fiber_grams: 25,
    sodium_mg: 2300,
  }
}
