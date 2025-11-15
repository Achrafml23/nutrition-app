import type { Meal } from "@/lib/types/nutrition"

export interface MealExportData {
  version: string
  exportDate: string
  meals: Meal[]
  metadata: {
    totalMeals: number
    traditionalMeals: number
    favoriteMeals: number
  }
}

export function exportMealsToJSON(meals: Meal[]): string {
  const exportData: MealExportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    meals: meals,
    metadata: {
      totalMeals: meals.length,
      traditionalMeals: meals.filter((meal) => meal.is_traditional).length,
      favoriteMeals: meals.filter((meal) => meal.is_favorite).length,
    },
  }

  return JSON.stringify(exportData, null, 2)
}

export function downloadMealsAsJSON(meals: Meal[], filename?: string) {
  const jsonData = exportMealsToJSON(meals)
  const blob = new Blob([jsonData], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename || `moroccan-meals-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function validateMealImportData(data: any): { isValid: boolean; error?: string; meals?: Meal[] } {
  try {
    if (!data || typeof data !== "object") {
      return { isValid: false, error: "Invalid file format" }
    }

    if (!data.meals || !Array.isArray(data.meals)) {
      return { isValid: false, error: "No meals found in file" }
    }

    // Validate each meal structure
    for (const meal of data.meals) {
      if (!meal.name || typeof meal.name !== "string") {
        return { isValid: false, error: "Invalid meal structure: missing name" }
      }

      if (!meal.ingredients || !Array.isArray(meal.ingredients)) {
        return { isValid: false, error: "Invalid meal structure: missing ingredients" }
      }

      if (
        typeof meal.total_calories !== "number" ||
        typeof meal.total_protein !== "number" ||
        typeof meal.total_carbohydrates !== "number" ||
        typeof meal.total_fat !== "number"
      ) {
        return { isValid: false, error: "Invalid meal structure: missing nutrition data" }
      }
    }

    return { isValid: true, meals: data.meals }
  } catch (error) {
    return { isValid: false, error: "Failed to parse file" }
  }
}

export function parseMealImportFile(file: File): Promise<{ isValid: boolean; error?: string; meals?: Meal[] }> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        resolve(validateMealImportData(data))
      } catch (error) {
        resolve({ isValid: false, error: "Failed to read file" })
      }
    }

    reader.onerror = () => {
      resolve({ isValid: false, error: "Failed to read file" })
    }

    reader.readAsText(file)
  })
}
