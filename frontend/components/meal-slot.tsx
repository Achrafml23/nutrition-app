"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { MealPlanItem, Meal, MealCategory, Ingredient } from "@/lib/types/nutrition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Clock, Utensils } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MealPlanItem as MealPlanItemComponent } from "./meal-plan-item"
import { IngredientSelectorWithQuantity } from "./ingredient-selector-with-quantity"
import { MealSelectorWithQuantity } from "./meal-selector-with-quantity"

interface MealSlotProps {
  mealCategory: MealCategory
  items: MealPlanItem[]
  onAddItem: (item: MealPlanItem) => void
  onUpdateItem: (item: MealPlanItem) => void
  onRemoveItem: (itemId: string) => void
  availableMeals?: Meal[]
}

export function MealSlot({
  mealCategory,
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  availableMeals = [],
}: MealSlotProps) {
  const { t } = useLanguage()
  const [showMealSelector, setShowMealSelector] = useState(false)
  const [showIngredientSelector, setShowIngredientSelector] = useState(false)

  const categoryName = t({
    ar: mealCategory.name_ar,
    fr: mealCategory.name_fr,
    en: mealCategory.name_en,
  })

  const totalCalories = items.reduce((sum, item) => sum + item.actual_calories, 0)

  const handleSelectMeal = (meal: Meal, amount: number, unit: "servings" | "grams") => {
    let actualAmount = amount
    let multiplier: number

    if (unit === "servings") {
      // Standard serving-based calculation
      multiplier = amount / meal.servings
      actualAmount = amount
    } else {
      // Gram-based calculation
      // Estimate total meal weight (rough estimate: calories * 2.5 grams per calorie)
      const estimatedTotalGrams = meal.total_calories * 2.5
      multiplier = amount / estimatedTotalGrams
      actualAmount = amount
    }

    const newItem: MealPlanItem = {
      id: `meal-${meal.id}-${Date.now()}`,
      type: "meal",
      meal,
      consumption_amount: actualAmount,
      consumption_unit: unit, // Added unit tracking
      consumption_percentage: multiplier * 100,
      actual_calories: meal.total_calories * multiplier,
      actual_protein: meal.total_protein * multiplier,
      actual_carbohydrates: meal.total_carbohydrates * multiplier,
      actual_fat: meal.total_fat * multiplier,
      actual_fiber: meal.total_fiber * multiplier,
      actual_sodium: meal.total_sodium * multiplier,
    }
    onAddItem(newItem)
    setShowMealSelector(false)
  }

  const handleSelectIngredient = (ingredient: Ingredient, quantity: number, unit: string) => {
    // Convert to grams for consistent calculation
    const gramsAmount = unit === "g" ? quantity : quantity * 100 // Assume cups/pieces = 100g
    const multiplier = gramsAmount / 100

    const newItem: MealPlanItem = {
      id: `ingredient-${ingredient.id}-${Date.now()}`,
      type: "ingredient",
      ingredient,
      consumption_amount: gramsAmount,
      consumption_percentage: 100,
      actual_calories: (ingredient.calories_per_100g || 0) * multiplier,
      actual_protein: (ingredient.protein_per_100g || 0) * multiplier,
      actual_carbohydrates: (ingredient.carbohydrates_per_100g || 0) * multiplier,
      actual_fat: (ingredient.fat_per_100g || 0) * multiplier,
      actual_fiber: (ingredient.fiber_per_100g || 0) * multiplier,
      actual_sodium: (ingredient.sodium_per_100g || 0) * multiplier,
    }
    onAddItem(newItem)
    setShowIngredientSelector(false)
  }

  return (
    <Card className="h-full" style={{ borderLeftColor: mealCategory.color, borderLeftWidth: "4px" }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mealCategory.color }} />
            <CardTitle className="text-lg">{categoryName}</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{mealCategory.typical_time}</span>
          </div>
        </div>
        {totalCalories > 0 && (
          <div className="text-sm text-muted-foreground">
            {Math.round(totalCalories)} {t({ ar: "سعرة", fr: "calories", en: "calories" })}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Assigned Items */}
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <MealPlanItemComponent key={item.id} item={item} onUpdate={onUpdateItem} onRemove={onRemoveItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Utensils className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">
              {t({
                ar: "لم يتم تخطيط وجبات بعد",
                fr: "Aucun repas planifié",
                en: "No meals planned",
              })}
            </p>
          </div>
        )}

        {/* Add Buttons */}
        <div className="flex gap-2">
          <Dialog open={showMealSelector} onOpenChange={setShowMealSelector}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                <Utensils className="h-4 w-4 mr-2" />
                {t({ ar: "إضافة وجبة", fr: "Ajouter repas", en: "Add meal" })}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {t({
                    ar: "اختر وجبة لـ",
                    fr: "Sélectionner un repas pour",
                    en: "Select meal for",
                  })}{" "}
                  {categoryName}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                <MealSelectorWithQuantity availableMeals={availableMeals} onSelect={handleSelectMeal} />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showIngredientSelector} onOpenChange={setShowIngredientSelector}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t({ ar: "إضافة مكون", fr: "Ajouter ingrédient", en: "Add ingredient" })}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>
                  {t({
                    ar: "اختر مكون لـ",
                    fr: "Sélectionner un ingrédient pour",
                    en: "Select ingredient for",
                  })}{" "}
                  {categoryName}
                </DialogTitle>
              </DialogHeader>
              <IngredientSelectorWithQuantity onSelect={handleSelectIngredient} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
