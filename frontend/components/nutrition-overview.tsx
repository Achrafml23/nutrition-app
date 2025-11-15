"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, TrendingDown, CheckCircle } from "lucide-react"

interface NutritionOverviewProps {
  todayNutrition: {
    calories: number
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
    sodium: number
  }
  goals: {
    calories: number
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
    sodium: number
  }
}

export function NutritionOverview({ todayNutrition, goals }: NutritionOverviewProps) {
  const { t } = useLanguage()

  const calculateProgress = (actual: number, goal: number) => {
    return goal > 0 ? Math.round((actual / goal) * 100) : 0
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90 && progress <= 110) return "text-green-600"
    if (progress >= 70 && progress <= 130) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressIcon = (progress: number) => {
    if (progress >= 90 && progress <= 110) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (progress > 110) return <TrendingUp className="h-4 w-4 text-red-600" />
    return <TrendingDown className="h-4 w-4 text-yellow-600" />
  }

  const nutrients = [
    {
      name: t({ ar: "السعرات الحرارية", fr: "Calories", en: "Calories" }),
      actual: todayNutrition.calories,
      goal: goals.calories,
      unit: "",
      color: "emerald",
    },
    {
      name: t({ ar: "البروتين", fr: "Protéines", en: "Protein" }),
      actual: todayNutrition.protein,
      goal: goals.protein,
      unit: "g",
      color: "blue",
    },
    {
      name: t({ ar: "الكربوهيدرات", fr: "Glucides", en: "Carbs" }),
      actual: todayNutrition.carbohydrates,
      goal: goals.carbohydrates,
      unit: "g",
      color: "green",
    },
    {
      name: t({ ar: "الدهون", fr: "Lipides", en: "Fat" }),
      actual: todayNutrition.fat,
      goal: goals.fat,
      unit: "g",
      color: "yellow",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          {t({
            ar: "نظرة عامة على التغذية اليوم",
            fr: "Aperçu Nutritionnel d'Aujourd'hui",
            en: "Today's Nutrition Overview",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nutrients.map((nutrient) => {
          const progress = calculateProgress(nutrient.actual, nutrient.goal)
          return (
            <div key={nutrient.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{nutrient.name}</span>
                <div className="flex items-center gap-2">
                  {getProgressIcon(progress)}
                  <span className={`text-sm font-bold ${getProgressColor(progress)}`}>
                    {Math.round(nutrient.actual)}
                    {nutrient.unit} / {Math.round(nutrient.goal)}
                    {nutrient.unit}
                  </span>
                  <Badge variant={progress >= 90 && progress <= 110 ? "default" : "secondary"} className="text-xs">
                    {progress}%
                  </Badge>
                </div>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2">
                <div
                  className={`h-full bg-${nutrient.color}-500 rounded-full transition-all`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </Progress>
            </div>
          )
        })}

        {/* Additional nutrients */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>{t({ ar: "الألياف", fr: "Fibres", en: "Fiber" })}</span>
            <div className="flex items-center gap-2">
              {getProgressIcon(calculateProgress(todayNutrition.fiber, goals.fiber))}
              <span className={getProgressColor(calculateProgress(todayNutrition.fiber, goals.fiber))}>
                {todayNutrition.fiber.toFixed(1)}g / {goals.fiber}g
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>{t({ ar: "الصوديوم", fr: "Sodium", en: "Sodium" })}</span>
            <div className="flex items-center gap-2">
              {getProgressIcon(calculateProgress(todayNutrition.sodium, goals.sodium))}
              <span className={getProgressColor(calculateProgress(todayNutrition.sodium, goals.sodium))}>
                {Math.round(todayNutrition.sodium)}mg / {goals.sodium}mg
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
