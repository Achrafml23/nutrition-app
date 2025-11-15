import type { Ingredient, MealIngredient } from "@/lib/types/nutrition"

export function calculateIngredientNutrition(
  ingredient: Ingredient,
  quantity: number,
  unit: string,
): Omit<MealIngredient, "id" | "ingredient"> {
  // Convert quantity to grams if needed
  let quantityInGrams = quantity

  if (unit !== "grams" && ingredient.unit_conversions[unit]) {
    quantityInGrams = quantity * ingredient.unit_conversions[unit]
  }

  // Calculate nutrition per 100g basis
  const factor = quantityInGrams / 100

  return {
    quantity,
    unit,
    calories: Math.round(ingredient.calories * factor * 100) / 100,
    protein: Math.round(ingredient.protein * factor * 100) / 100,
    carbohydrates: Math.round(ingredient.carbohydrates * factor * 100) / 100,
    fat: Math.round(ingredient.fat * factor * 100) / 100,
    fiber: Math.round(ingredient.fiber * factor * 100) / 100,
    sodium: Math.round(ingredient.sodium * factor * 100) / 100,
  }
}

export function calculateMealTotals(mealIngredients: MealIngredient[]) {
  return mealIngredients.reduce(
    (totals, ingredient) => ({
      total_calories: Math.round((totals.total_calories + ingredient.calories) * 100) / 100,
      total_protein: Math.round((totals.total_protein + ingredient.protein) * 100) / 100,
      total_carbohydrates: Math.round((totals.total_carbohydrates + ingredient.carbohydrates) * 100) / 100,
      total_fat: Math.round((totals.total_fat + ingredient.fat) * 100) / 100,
      total_fiber: Math.round((totals.total_fiber + ingredient.fiber) * 100) / 100,
      total_sodium: Math.round((totals.total_sodium + ingredient.sodium) * 100) / 100,
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
