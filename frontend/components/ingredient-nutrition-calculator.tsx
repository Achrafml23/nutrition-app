"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Ingredient } from "@/lib/types/nutrition"
import { calculateIngredientNutrition } from "@/lib/utils/nutrition-calculator"
import { IngredientSelector } from "./ingredient-selector"
import { NutritionSummary } from "./nutrition-summary"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Plus, X, Leaf, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalculatedIngredient {
  id: string
  ingredient: Ingredient
  quantity: number
  unit: string
  nutrition: ReturnType<typeof calculateIngredientNutrition>
}

export function IngredientNutritionCalculator() {
  const { t, secondLanguage } = useLanguage()
  const [calculatedIngredients, setCalculatedIngredients] = useState<CalculatedIngredient[]>([])

  const handleAddIngredient = (ingredient: Ingredient) => {
    const defaultQuantity = ingredient.typical_serving || 100
    const defaultUnit = ingredient.default_unit || "grams"
    const nutrition = calculateIngredientNutrition(ingredient, defaultQuantity, defaultUnit)

    const calculatedIngredient: CalculatedIngredient = {
      id: `${ingredient.id}-${Date.now()}`,
      ingredient,
      quantity: defaultQuantity,
      unit: defaultUnit,
      nutrition,
    }

    setCalculatedIngredients((prev) => [...prev, calculatedIngredient])
  }

  const handleUpdateQuantity = (id: string, quantity: number, unit: string) => {
    setCalculatedIngredients((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nutrition = calculateIngredientNutrition(item.ingredient, quantity, unit)
          return { ...item, quantity, unit, nutrition }
        }
        return item
      }),
    )
  }

  const handleRemoveIngredient = (id: string) => {
    setCalculatedIngredients((prev) => prev.filter((item) => item.id !== id))
  }

  const totalNutrition = calculatedIngredients.reduce(
    (totals, item) => ({
      calories: totals.calories + item.nutrition.calories,
      protein: totals.protein + item.nutrition.protein,
      carbohydrates: totals.carbohydrates + item.nutrition.carbohydrates,
      fat: totals.fat + item.nutrition.fat,
      fiber: totals.fiber + item.nutrition.fiber,
      sodium: totals.sodium + item.nutrition.sodium,
    }),
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sodium: 0 },
  )

  const getIngredientName = (ingredient: Ingredient) => {
    return t({
      ar: ingredient.name_ar,
      fr: ingredient.name_fr,
      en: ingredient.name_en,
    })
  }

  const getSecondLanguageTranslation = (ingredient: Ingredient) => {
    if (!secondLanguage) return null

    const translations = {
      ar: ingredient.name_ar,
      fr: ingredient.name_fr,
      en: ingredient.name_en,
    }

    return translations[secondLanguage]
  }

  const getUnitName = (unit: string) => {
    const unitNames = {
      grams: t({ ar: "جرام", fr: "grammes", en: "grams" }),
      pieces: t({ ar: "قطع", fr: "pièces", en: "pieces" }),
      cups: t({ ar: "أكواب", fr: "tasses", en: "cups" }),
      tablespoons: t({ ar: "ملاعق كبيرة", fr: "c. à soupe", en: "tbsp" }),
      teaspoons: t({ ar: "ملاعق صغيرة", fr: "c. à café", en: "tsp" }),
    }
    return unitNames[unit as keyof typeof unitNames] || unit
  }

  return (
    <div className="space-y-6">
      {/* Add Ingredient Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-emerald-600" />
            {t({
              ar: "حاسبة التغذية للمكونات",
              fr: "Calculateur Nutritionnel d'Ingrédients",
              en: "Ingredient Nutrition Calculator",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientSelector onIngredientSelect={handleAddIngredient}>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              {t({ ar: "إضافة مكون للحساب", fr: "Ajouter un ingrédient", en: "Add ingredient to calculate" })}
            </Button>
          </IngredientSelector>
        </CardContent>
      </Card>

      {/* Calculated Ingredients */}
      {calculatedIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t({
                ar: "المكونات المحسوبة",
                fr: "Ingrédients Calculés",
                en: "Calculated Ingredients",
              })}
              <span className="text-sm font-normal text-muted-foreground ml-2">({calculatedIngredients.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calculatedIngredients.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{getIngredientName(item.ingredient)}</h4>
                      {item.ingredient.is_traditional && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
                        </Badge>
                      )}
                      {item.ingredient.is_halal && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <Leaf className="h-3 w-3 mr-1" />
                          {t({ ar: "حلال", fr: "Halal", en: "Halal" })}
                        </Badge>
                      )}
                    </div>
                    {(() => {
                      const secondLanguageTranslation = getSecondLanguageTranslation(item.ingredient)
                      return secondLanguageTranslation &&
                        secondLanguageTranslation !== getIngredientName(item.ingredient) ? (
                        <p className="text-sm text-emerald-600 font-medium mb-2">{secondLanguageTranslation}</p>
                      ) : null
                    })()}

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mb-3">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item.id, Number.parseFloat(e.target.value) || 0, item.unit)
                        }
                        className="w-24 h-8"
                        min="0"
                        step="0.1"
                      />
                      <Select
                        value={item.unit}
                        onValueChange={(unit) => handleUpdateQuantity(item.id, item.quantity, unit)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.ingredient.measurement_units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {getUnitName(unit)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Nutrition Display */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-semibold text-emerald-600">{Math.round(item.nutrition.calories)}</div>
                        <div className="text-xs text-gray-500">{t({ ar: "سعرة", fr: "cal", en: "cal" })}</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-semibold text-blue-600">{item.nutrition.protein.toFixed(1)}g</div>
                        <div className="text-xs text-gray-500">
                          {t({ ar: "بروتين", fr: "Protéines", en: "Protein" })}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-semibold text-green-600">{item.nutrition.carbohydrates.toFixed(1)}g</div>
                        <div className="text-xs text-gray-500">
                          {t({ ar: "كربوهيدرات", fr: "Glucides", en: "Carbs" })}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-white rounded border">
                        <div className="font-semibold text-yellow-600">{item.nutrition.fat.toFixed(1)}g</div>
                        <div className="text-xs text-gray-500">{t({ ar: "دهون", fr: "Lipides", en: "Fat" })}</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveIngredient(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Total Nutrition Summary */}
      {calculatedIngredients.length > 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t({
              ar: "إجمالي التغذية",
              fr: "Nutrition Totale",
              en: "Total Nutrition",
            })}
          </h3>
          <NutritionSummary
            calories={totalNutrition.calories}
            protein={totalNutrition.protein}
            carbohydrates={totalNutrition.carbohydrates}
            fat={totalNutrition.fat}
            fiber={totalNutrition.fiber}
            sodium={totalNutrition.sodium}
          />
        </div>
      )}

      {calculatedIngredients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">
            {t({
              ar: "أضف مكونات لحساب قيمها الغذائية",
              fr: "Ajoutez des ingrédients pour calculer leurs valeurs nutritionnelles",
              en: "Add ingredients to calculate their nutritional values",
            })}
          </p>
        </div>
      )}
    </div>
  )
}
