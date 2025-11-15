"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Ingredient, MealIngredient, Meal } from "@/lib/types/nutrition"
import { calculateIngredientNutrition, calculateMealTotals } from "@/lib/utils/nutrition-calculator"
import { calculateMealTotalWeight } from "@/lib/utils/meal-calculations"
import { IngredientSelector } from "./ingredient-selector"
import { MealIngredientItem } from "./meal-ingredient-item"
import { NutritionSummary } from "./nutrition-summary"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Plus, Save, Users, Scale } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface MealBuilderProps {
  initialMeal?: Meal
  onSave?: (meal: Meal) => void
}

export function MealBuilder({ initialMeal, onSave }: MealBuilderProps) {
  const { t } = useLanguage()
  const [mealName, setMealName] = useState(initialMeal?.name || "")
  const [mealDescription, setMealDescription] = useState(initialMeal?.description || "")
  const [servings, setServings] = useState(initialMeal?.servings || 1)
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>(initialMeal?.ingredients || [])
  const [servingMode, setServingMode] = useState<"servings" | "grams-per-serving">("servings")
  const [gramsPerServing, setGramsPerServing] = useState(250) // Default 250g per serving

  const mealTotals = calculateMealTotals(mealIngredients)
  const totalMealWeight = calculateMealTotalWeight(mealIngredients)
  const calculatedServings =
    servingMode === "grams-per-serving" && gramsPerServing > 0
      ? Math.max(1, Math.round(totalMealWeight / gramsPerServing))
      : servings

  const handleAddIngredient = (ingredient: Ingredient) => {
    const defaultQuantity = ingredient.typical_serving || 100
    const defaultUnit = ingredient.default_unit || "grams"

    const nutritionData = calculateIngredientNutrition(ingredient, defaultQuantity, defaultUnit)

    const mealIngredient: MealIngredient = {
      id: uuidv4(),
      ingredient,
      ...nutritionData,
    }

    setMealIngredients((prev) => [...prev, mealIngredient])
  }

  const handleUpdateIngredient = (id: string, quantity: number, unit: string) => {
    setMealIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nutritionData = calculateIngredientNutrition(item.ingredient, quantity, unit)
          return {
            ...item,
            ...nutritionData,
          }
        }
        return item
      }),
    )
  }

  const handleRemoveIngredient = (id: string) => {
    setMealIngredients((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSaveMeal = () => {
    if (!mealName.trim() || mealIngredients.length === 0) return

    const meal: Meal = {
      id: initialMeal?.id,
      name: mealName.trim(),
      description: mealDescription.trim(),
      ingredients: mealIngredients,
      servings: calculatedServings,
      is_favorite: initialMeal?.is_favorite || false,
      is_traditional: mealIngredients.some((item) => item.ingredient.is_traditional),
      ...mealTotals,
    }

    onSave?.(meal)
  }

  const canSave = mealName.trim() && mealIngredients.length > 0

  return (
    <div className="space-y-6">
      {/* Meal Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t({
              ar: "معلومات الوجبة",
              fr: "Informations du Repas",
              en: "Meal Information",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t({ ar: "اسم الوجبة", fr: "Nom du repas", en: "Meal name" })}
            </label>
            <Input
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder={t({
                ar: "أدخل اسم الوجبة...",
                fr: "Entrez le nom du repas...",
                en: "Enter meal name...",
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t({ ar: "الوصف (اختياري)", fr: "Description (optionnel)", en: "Description (optional)" })}
            </label>
            <Textarea
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              placeholder={t({
                ar: "وصف الوجبة...",
                fr: "Description du repas...",
                en: "Meal description...",
              })}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              {t({ ar: "طريقة تحديد الحصص", fr: "Mode de portion", en: "Serving mode" })}
            </label>
            <RadioGroup
              value={servingMode}
              onValueChange={(value) => setServingMode(value as "servings" | "grams-per-serving")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="servings" id="servings" />
                <Label htmlFor="servings" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t({ ar: "تحديد عدد الحصص", fr: "Définir le nombre de portions", en: "Set number of servings" })}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grams-per-serving" id="grams-per-serving" />
                <Label htmlFor="grams-per-serving" className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  {t({
                    ar: "تحديد الجرامات لكل حصة",
                    fr: "Définir les grammes par portion",
                    en: "Set grams per serving",
                  })}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {servingMode === "servings" ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                {t({ ar: "عدد الحصص", fr: "Nombre de portions", en: "Number of servings" })}
              </label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-20"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t({ ar: "الجرامات لكل حصة", fr: "Grammes par portion", en: "Grams per serving" })}
                </label>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={gramsPerServing}
                    onChange={(e) => setGramsPerServing(Math.max(1, Number.parseInt(e.target.value) || 250))}
                    min="1"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">g</span>
                </div>
              </div>

              {mealIngredients.length > 0 && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>
                        {t({ ar: "إجمالي وزن الوجبة:", fr: "Poids total du repas:", en: "Total meal weight:" })}
                      </span>
                      <span className="font-medium">{totalMealWeight.toFixed(0)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {t({ ar: "عدد الحصص المحسوب:", fr: "Portions calculées:", en: "Calculated servings:" })}
                      </span>
                      <span className="font-medium">{calculatedServings}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Ingredients */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {t({
                ar: "المكونات",
                fr: "Ingrédients",
                en: "Ingredients",
              })}
              {mealIngredients.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">({mealIngredients.length})</span>
              )}
            </CardTitle>
            <IngredientSelector onIngredientSelect={handleAddIngredient}>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t({ ar: "إضافة مكون", fr: "Ajouter ingrédient", en: "Add ingredient" })}
              </Button>
            </IngredientSelector>
          </div>
        </CardHeader>
        <CardContent>
          {mealIngredients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t({
                ar: "لم تتم إضافة مكونات بعد",
                fr: "Aucun ingrédient ajouté",
                en: "No ingredients added yet",
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {mealIngredients.map((mealIngredient) => (
                <MealIngredientItem
                  key={mealIngredient.id}
                  mealIngredient={mealIngredient}
                  onUpdate={handleUpdateIngredient}
                  onRemove={handleRemoveIngredient}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      {mealIngredients.length > 0 && (
        <NutritionSummary
          calories={mealTotals.total_calories}
          protein={mealTotals.total_protein}
          carbohydrates={mealTotals.total_carbohydrates}
          fat={mealTotals.total_fat}
          fiber={mealTotals.total_fiber}
          sodium={mealTotals.total_sodium}
          servings={calculatedServings}
        />
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveMeal} disabled={!canSave} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4 mr-2" />
          {t({ ar: "حفظ الوجبة", fr: "Sauvegarder le repas", en: "Save meal" })}
        </Button>
      </div>
    </div>
  )
}
