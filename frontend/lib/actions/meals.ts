"use server"

import { createClient } from "@/lib/supabase/server"
import type { Meal } from "@/lib/types/nutrition"
import { revalidatePath } from "next/cache"

export async function saveMeal(meal: Meal) {
  const supabase = await createClient()

  try {
    // Insert the meal without user_id (now nullable)
    const { data: savedMeal, error: mealError } = await supabase
      .from("meals")
      .insert({
        name: meal.name,
        description: meal.description,
        servings: meal.servings,
        total_calories: meal.total_calories,
        total_protein: meal.total_protein,
        total_carbohydrates: meal.total_carbohydrates,
        total_fat: meal.total_fat,
        total_fiber: meal.total_fiber,
        total_sodium: meal.total_sodium,
        is_favorite: meal.is_favorite,
        is_traditional: meal.is_traditional,
        // user_id is now nullable, so we don't set it
      })
      .select()
      .single()

    if (mealError) {
      console.error("Error saving meal:", mealError)
      return { success: false, error: mealError.message }
    }

    // Insert meal ingredients
    const mealIngredients = meal.ingredients.map((ingredient) => ({
      meal_id: savedMeal.id,
      ingredient_id: ingredient.ingredient.id,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbohydrates: ingredient.carbohydrates,
      fat: ingredient.fat,
      fiber: ingredient.fiber,
      sodium: ingredient.sodium,
    }))

    const { error: ingredientsError } = await supabase.from("meal_ingredients").insert(mealIngredients)

    if (ingredientsError) {
      console.error("Error saving meal ingredients:", ingredientsError)
      return { success: false, error: ingredientsError.message }
    }

    revalidatePath("/meal-builder")
    revalidatePath("/dashboard")

    return { success: true, meal: savedMeal }
  } catch (error) {
    console.error("Unexpected error saving meal:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getUserMeals() {
  const supabase = await createClient()

  try {
    const { data: meals, error } = await supabase
      .from("meals")
      .select(`
        *,
        meal_ingredients (
          *,
          ingredients (*)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching meals:", error)
      return { success: false, error: error.message }
    }

    return { success: true, meals: meals || [] }
  } catch (error) {
    console.error("Unexpected error fetching meals:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getMealById(mealId: string) {
  const supabase = await createClient()

  try {
    const { data: meal, error } = await supabase
      .from("meals")
      .select(`
        *,
        meal_ingredients (
          *,
          ingredients (*)
        )
      `)
      .eq("id", mealId)
      .single()

    if (error) {
      console.error("Error fetching meal:", error)
      return { success: false, error: error.message }
    }

    if (!meal) {
      return { success: false, error: "Meal not found" }
    }

    // Transform the data to match our Meal type
    const transformedMeal = {
      ...meal,
      ingredients: meal.meal_ingredients.map((mi: any) => ({
        id: mi.id,
        ingredient: mi.ingredients,
        quantity: mi.quantity,
        unit: mi.unit,
        calories: mi.calories,
        protein: mi.protein,
        carbohydrates: mi.carbohydrates,
        fat: mi.fat,
        fiber: mi.fiber,
        sodium: mi.sodium,
      })),
    }

    return { success: true, meal: transformedMeal }
  } catch (error) {
    console.error("Unexpected error fetching meal:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateMeal(meal: Meal) {
  const supabase = await createClient()

  if (!meal.id) {
    return { success: false, error: "Meal ID is required for updates" }
  }

  try {
    // Update the meal
    const { data: updatedMeal, error: mealError } = await supabase
      .from("meals")
      .update({
        name: meal.name,
        description: meal.description,
        servings: meal.servings,
        total_calories: meal.total_calories,
        total_protein: meal.total_protein,
        total_carbohydrates: meal.total_carbohydrates,
        total_fat: meal.total_fat,
        total_fiber: meal.total_fiber,
        total_sodium: meal.total_sodium,
        is_favorite: meal.is_favorite,
        is_traditional: meal.is_traditional,
      })
      .eq("id", meal.id)
      .select()
      .single()

    if (mealError) {
      console.error("Error updating meal:", mealError)
      return { success: false, error: mealError.message }
    }

    // Delete existing meal ingredients
    const { error: deleteError } = await supabase.from("meal_ingredients").delete().eq("meal_id", meal.id)

    if (deleteError) {
      console.error("Error deleting old meal ingredients:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // Insert updated meal ingredients
    const mealIngredients = meal.ingredients.map((ingredient) => ({
      meal_id: meal.id,
      ingredient_id: ingredient.ingredient.id,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbohydrates: ingredient.carbohydrates,
      fat: ingredient.fat,
      fiber: ingredient.fiber,
      sodium: ingredient.sodium,
    }))

    const { error: ingredientsError } = await supabase.from("meal_ingredients").insert(mealIngredients)

    if (ingredientsError) {
      console.error("Error saving updated meal ingredients:", ingredientsError)
      return { success: false, error: ingredientsError.message }
    }

    revalidatePath("/meals")
    revalidatePath("/meal-builder")
    revalidatePath("/dashboard")

    return { success: true, meal: updatedMeal }
  } catch (error) {
    console.error("Unexpected error updating meal:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteMeal(mealId: string) {
  const supabase = await createClient()

  try {
    // Delete meal ingredients first (foreign key constraint)
    const { error: ingredientsError } = await supabase.from("meal_ingredients").delete().eq("meal_id", mealId)

    if (ingredientsError) {
      console.error("Error deleting meal ingredients:", ingredientsError)
      return { success: false, error: ingredientsError.message }
    }

    // Delete the meal
    const { error: mealError } = await supabase.from("meals").delete().eq("id", mealId)

    if (mealError) {
      console.error("Error deleting meal:", mealError)
      return { success: false, error: mealError.message }
    }

    revalidatePath("/meals")
    revalidatePath("/meal-builder")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting meal:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function toggleMealFavorite(mealId: string, isFavorite: boolean) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("meals").update({ is_favorite: isFavorite }).eq("id", mealId)

    if (error) {
      console.error("Error toggling meal favorite:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/meals")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Unexpected error toggling favorite:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
