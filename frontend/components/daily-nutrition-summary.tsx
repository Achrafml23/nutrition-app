"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import type { DailyPlan, NutritionGoals } from "@/lib/types/nutrition"
import { calculateGoalProgress } from "@/lib/utils/meal-planning"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, TrendingDown, CheckCircle } from "lucide-react"

interface DailyNutritionSummaryProps {
  dailyPlan: DailyPlan
  goals: NutritionGoals
}

export function DailyNutritionSummary({ dailyPlan, goals }: DailyNutritionSummaryProps) {
  const { t } = useLanguage()

  const caloriesProgress = calculateGoalProgress(dailyPlan.total_calories, goals.daily_calories)
  const proteinGoal = (goals.daily_calories * goals.protein_percentage) / 100 / 4 // grams
  const carbsGoal = (goals.daily_calories * goals.carbs_percentage) / 100 / 4 // grams
  const fatGoal = (goals.daily_calories * goals.fat_percentage) / 100 / 9 // grams

  const proteinProgress = calculateGoalProgress(dailyPlan.total_protein, proteinGoal)
  const carbsProgress = calculateGoalProgress(dailyPlan.total_carbohydrates, carbsGoal)
  const fatProgress = calculateGoalProgress(dailyPlan.total_fat, fatGoal)
  const fiberProgress = calculateGoalProgress(dailyPlan.total_fiber, goals.fiber_grams)
  const sodiumProgress = calculateGoalProgress(dailyPlan.total_sodium, goals.sodium_mg)

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

  const getProgressBadge = (progress: number) => {
    if (progress >= 90 && progress <= 110) return "default"
    if (progress >= 70 && progress <= 130) return "secondary"
    return "destructive"
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-emerald-800">
          <Target className="h-5 w-5" />
          {t({
            ar: "ملخص التغذية اليومية",
            fr: "Résumé Nutritionnel Quotidien",
            en: "Daily Nutrition Summary",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t({ ar: "السعرات الحرارية", fr: "Calories", en: "Calories" })}</span>
            <div className="flex items-center gap-2">
              {getProgressIcon(caloriesProgress)}
              <span className={`font-bold ${getProgressColor(caloriesProgress)}`}>
                {Math.round(dailyPlan.total_calories)} / {goals.daily_calories}
              </span>
              <Badge variant={getProgressBadge(caloriesProgress)} className="text-xs">
                {caloriesProgress}%
              </Badge>
            </div>
          </div>
          <Progress value={Math.min(caloriesProgress, 100)} className="h-2" />
        </div>

        {/* Macronutrients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Protein */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{t({ ar: "البروتين", fr: "Protéines", en: "Protein" })}</span>
              <div className="flex items-center gap-1">
                {getProgressIcon(proteinProgress)}
                <span className={getProgressColor(proteinProgress)}>{dailyPlan.total_protein.toFixed(1)}g</span>
              </div>
            </div>
            <Progress value={Math.min(proteinProgress, 100)} className="h-2 bg-blue-100">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
              />
            </Progress>
            <div className="text-xs text-muted-foreground text-center">
              {t({ ar: "الهدف", fr: "Objectif", en: "Goal" })}: {proteinGoal.toFixed(1)}g
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{t({ ar: "الكربوهيدرات", fr: "Glucides", en: "Carbs" })}</span>
              <div className="flex items-center gap-1">
                {getProgressIcon(carbsProgress)}
                <span className={getProgressColor(carbsProgress)}>{dailyPlan.total_carbohydrates.toFixed(1)}g</span>
              </div>
            </div>
            <Progress value={Math.min(carbsProgress, 100)} className="h-2 bg-green-100">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${Math.min(carbsProgress, 100)}%` }}
              />
            </Progress>
            <div className="text-xs text-muted-foreground text-center">
              {t({ ar: "الهدف", fr: "Objectif", en: "Goal" })}: {carbsGoal.toFixed(1)}g
            </div>
          </div>

          {/* Fat */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{t({ ar: "الدهون", fr: "Lipides", en: "Fat" })}</span>
              <div className="flex items-center gap-1">
                {getProgressIcon(fatProgress)}
                <span className={getProgressColor(fatProgress)}>{dailyPlan.total_fat.toFixed(1)}g</span>
              </div>
            </div>
            <Progress value={Math.min(fatProgress, 100)} className="h-2 bg-yellow-100">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all"
                style={{ width: `${Math.min(fatProgress, 100)}%` }}
              />
            </Progress>
            <div className="text-xs text-muted-foreground text-center">
              {t({ ar: "الهدف", fr: "Objectif", en: "Goal" })}: {fatGoal.toFixed(1)}g
            </div>
          </div>
        </div>

        {/* Additional Nutrients */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>{t({ ar: "الألياف", fr: "Fibres", en: "Fiber" })}</span>
            <div className="flex items-center gap-2">
              {getProgressIcon(fiberProgress)}
              <span className={getProgressColor(fiberProgress)}>
                {dailyPlan.total_fiber.toFixed(1)}g / {goals.fiber_grams}g
              </span>
              <Badge variant={getProgressBadge(fiberProgress)} className="text-xs">
                {fiberProgress}%
              </Badge>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>{t({ ar: "الصوديوم", fr: "Sodium", en: "Sodium" })}</span>
            <div className="flex items-center gap-2">
              {getProgressIcon(sodiumProgress)}
              <span className={getProgressColor(sodiumProgress)}>
                {Math.round(dailyPlan.total_sodium)}mg / {goals.sodium_mg}mg
              </span>
              <Badge variant={getProgressBadge(sodiumProgress)} className="text-xs">
                {sodiumProgress}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
