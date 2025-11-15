import type { Meal, MealIngredient } from "@/lib/types/nutrition"

export function calculateMealTotalWeight(mealIngredients: MealIngredient[]): number {
  // Handle cases where mealIngredients is not an array or is undefined
  if (!mealIngredients || !Array.isArray(mealIngredients)) {
    return 0
  }

  let totalGrams = 0

  for (const mealIngredient of mealIngredients) {
    if (!mealIngredient || !mealIngredient.ingredient) {
      continue
    }

    const ingredient = mealIngredient.ingredient
    const quantity = mealIngredient.quantity || 0
    const unit = mealIngredient.unit || "g"

    // Convert quantity to grams using unit conversions
    let gramsForThisIngredient = 0

    if (unit === "g" || unit === "grams") {
      gramsForThisIngredient = quantity
    } else if (ingredient.unit_conversions && ingredient.unit_conversions[unit]) {
      // Convert using the conversion factor (assumes conversions are to grams)
      gramsForThisIngredient = quantity * ingredient.unit_conversions[unit]
    } else {
      // Fallback conversions for common units
      switch (unit) {
        case "cups":
          gramsForThisIngredient = quantity * 240 // Average cup weight
          break
        case "tbsp":
        case "tablespoons":
          gramsForThisIngredient = quantity * 15
          break
        case "tsp":
        case "teaspoons":
          gramsForThisIngredient = quantity * 5
          break
        case "pieces":
        case "items":
          gramsForThisIngredient = quantity * (ingredient.typical_serving || 50)
          break
        default:
          gramsForThisIngredient = quantity * (ingredient.typical_serving || 100)
      }
    }

    totalGrams += gramsForThisIngredient
  }

  return Math.round(totalGrams)
}

export function calculateMealWeightInGrams(meal: Meal): number {
  if (!meal || !meal.ingredients) {
    return 0
  }
  return calculateMealTotalWeight(meal.ingredients)
}

export function calculateGramsPerServing(meal: Meal): number {
  if (!meal || !meal.servings || meal.servings <= 0) {
    return 0
  }
  const totalGrams = calculateMealWeightInGrams(meal)
  return Math.round(totalGrams / meal.servings)
}
