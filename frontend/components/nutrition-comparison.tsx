"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Ingredient } from "@/lib/types/nutrition"
import { IngredientSelector } from "./ingredient-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Scale, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ComparisonIngredient {
  id: string
  ingredient: Ingredient
}

export function NutritionComparison() {
  const { t } = useLanguage()
  const [comparisonIngredients, setComparisonIngredients] = useState<ComparisonIngredient[]>([])

  const handleAddIngredient = (ingredient: Ingredient) => {
    if (comparisonIngredients.length >= 4) return // Limit to 4 ingredients for comparison

    const comparisonIngredient: ComparisonIngredient = {
      id: `${ingredient.id}-${Date.now()}`,
      ingredient,
    }

    setComparisonIngredients((prev) => [...prev, comparisonIngredient])
  }

  const handleRemoveIngredient = (id: string) => {
    setComparisonIngredients((prev) => prev.filter((item) => item.id !== id))
  }

  const getIngredientName = (ingredient: Ingredient) => {
    return t({
      ar: ingredient.name_ar,
      fr: ingredient.name_fr,
      en: ingredient.name_en,
    })
  }

  const getComparisonIcon = (value: number, maxValue: number) => {
    const percentage = (value / maxValue) * 100
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (percentage >= 40) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const nutritionFields = [
    { key: "calories", label: { ar: "السعرات الحرارية", fr: "Calories", en: "Calories" }, unit: "" },
    { key: "protein", label: { ar: "البروتين", fr: "Protéines", en: "Protein" }, unit: "g" },
    { key: "carbohydrates", label: { ar: "الكربوهيدرات", fr: "Glucides", en: "Carbohydrates" }, unit: "g" },
    { key: "fat", label: { ar: "الدهون", fr: "Lipides", en: "Fat" }, unit: "g" },
    { key: "fiber", label: { ar: "الألياف", fr: "Fibres", en: "Fiber" }, unit: "g" },
    { key: "sodium", label: { ar: "الصوديوم", fr: "Sodium", en: "Sodium" }, unit: "mg" },
  ]

  return (
    <div className="space-y-6">
      {/* Add Ingredients for Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-600" />
            {t({
              ar: "مقارنة التغذية",
              fr: "Comparaison Nutritionnelle",
              en: "Nutrition Comparison",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <IngredientSelector onIngredientSelect={handleAddIngredient}>
              <Button variant="outline" disabled={comparisonIngredients.length >= 4} className="flex-1 max-w-xs">
                <Plus className="h-4 w-4 mr-2" />
                {t({ ar: "إضافة للمقارنة", fr: "Ajouter à la comparaison", en: "Add to compare" })}
              </Button>
            </IngredientSelector>
            {comparisonIngredients.length >= 4 && (
              <Badge variant="secondary" className="text-xs">
                {t({ ar: "الحد الأقصى 4 مكونات", fr: "Maximum 4 ingrédients", en: "Maximum 4 ingredients" })}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {comparisonIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t({
                ar: "مقارنة القيم الغذائية (لكل 100 جرام)",
                fr: "Comparaison des Valeurs Nutritionnelles (pour 100g)",
                en: "Nutritional Values Comparison (per 100g)",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">
                      {t({ ar: "المكون", fr: "Ingrédient", en: "Ingredient" })}
                    </th>
                    {nutritionFields.map((field) => (
                      <th key={field.key} className="text-center p-3 font-medium text-sm">
                        {t(field.label)}
                        {field.unit && <span className="text-xs text-muted-foreground ml-1">({field.unit})</span>}
                      </th>
                    ))}
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonIngredients.map((item) => {
                    const maxValues = nutritionFields.reduce(
                      (max, field) => ({
                        ...max,
                        [field.key]: Math.max(
                          max[field.key] || 0,
                          ...comparisonIngredients.map(
                            (ing) => ing.ingredient[field.key as keyof Ingredient] as number,
                          ),
                        ),
                      }),
                      {} as Record<string, number>,
                    )

                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-sm">{getIngredientName(item.ingredient)}</div>
                            <div className="flex gap-1 mt-1">
                              {item.ingredient.is_traditional && (
                                <Badge variant="secondary" className="text-xs">
                                  {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        {nutritionFields.map((field) => {
                          const value = item.ingredient[field.key as keyof Ingredient] as number
                          const maxValue = maxValues[field.key]
                          return (
                            <td key={field.key} className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                {getComparisonIcon(value, maxValue)}
                                <span className="text-sm font-medium">{value}</span>
                              </div>
                            </td>
                          )
                        })}
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveIngredient(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {comparisonIngredients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Scale className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">
            {t({
              ar: "أضف مكونات لمقارنة قيمها الغذائية",
              fr: "Ajoutez des ingrédients pour comparer leurs valeurs nutritionnelles",
              en: "Add ingredients to compare their nutritional values",
            })}
          </p>
        </div>
      )}
    </div>
  )
}
