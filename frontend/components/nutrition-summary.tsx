"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface NutritionSummaryProps {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  sodium: number
  servings?: number
}

export function NutritionSummary({
  calories,
  protein,
  carbohydrates,
  fat,
  fiber,
  sodium,
  servings = 1,
}: NutritionSummaryProps) {
  const { t } = useLanguage()

  // Calculate per serving if servings > 1
  const perServing = servings > 1
  const displayCalories = perServing ? Math.round(calories / servings) : calories
  const displayProtein = perServing ? Math.round((protein / servings) * 100) / 100 : protein
  const displayCarbs = perServing ? Math.round((carbohydrates / servings) * 100) / 100 : carbohydrates
  const displayFat = perServing ? Math.round((fat / servings) * 100) / 100 : fat
  const displayFiber = perServing ? Math.round((fiber / servings) * 100) / 100 : fiber
  const displaySodium = perServing ? Math.round((sodium / servings) * 100) / 100 : sodium

  // Calculate macronutrient percentages
  const totalMacros = displayProtein * 4 + displayCarbs * 4 + displayFat * 9
  const proteinPercent = totalMacros > 0 ? ((displayProtein * 4) / totalMacros) * 100 : 0
  const carbsPercent = totalMacros > 0 ? ((displayCarbs * 4) / totalMacros) * 100 : 0
  const fatPercent = totalMacros > 0 ? ((displayFat * 9) / totalMacros) * 100 : 0

  return (
    <Card className="border-emerald-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-emerald-800">
          {t({
            ar: "ملخص التغذية",
            fr: "Résumé Nutritionnel",
            en: "Nutrition Summary",
          })}
          {perServing && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({t({ ar: "لكل حصة", fr: "par portion", en: "per serving" })})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calories */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">
            {t({ ar: "السعرات الحرارية", fr: "Calories", en: "Calories" })}
          </span>
          <span className="text-2xl font-bold text-emerald-600">{displayCalories}</span>
        </div>

        {/* Macronutrients */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{t({ ar: "البروتين", fr: "Protéines", en: "Protein" })}</span>
              <span className="font-medium">
                {displayProtein}g ({Math.round(proteinPercent)}%)
              </span>
            </div>
            <Progress value={proteinPercent} className="h-2 bg-blue-100">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${proteinPercent}%` }} />
            </Progress>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{t({ ar: "الكربوهيدرات", fr: "Glucides", en: "Carbohydrates" })}</span>
              <span className="font-medium">
                {displayCarbs}g ({Math.round(carbsPercent)}%)
              </span>
            </div>
            <Progress value={carbsPercent} className="h-2 bg-green-100">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${carbsPercent}%` }} />
            </Progress>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{t({ ar: "الدهون", fr: "Lipides", en: "Fat" })}</span>
              <span className="font-medium">
                {displayFat}g ({Math.round(fatPercent)}%)
              </span>
            </div>
            <Progress value={fatPercent} className="h-2 bg-yellow-100">
              <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${fatPercent}%` }} />
            </Progress>
          </div>
        </div>

        {/* Additional nutrients */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t({ ar: "الألياف", fr: "Fibres", en: "Fiber" })}</span>
            <span className="font-medium">{displayFiber}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t({ ar: "الصوديوم", fr: "Sodium", en: "Sodium" })}</span>
            <span className="font-medium">{displaySodium}mg</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
