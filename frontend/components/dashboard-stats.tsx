"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Award, Calendar } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    todayCalories: number
    calorieGoal: number
    weeklyAverage: number
    mealsPlanned: number
    favoriteMeals: number
    traditionalMealsCount: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useLanguage()

  const calorieProgress = Math.round((stats.todayCalories / stats.calorieGoal) * 100)
  const weeklyTrend = stats.weeklyAverage > stats.calorieGoal ? "up" : "down"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Calories */}
      <Card className="border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t({ ar: "سعرات اليوم", fr: "Calories Aujourd'hui", en: "Today's Calories" })}
          </CardTitle>
          <Target className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-700">{stats.todayCalories}</div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground">
              {t({ ar: "من", fr: "sur", en: "of" })} {stats.calorieGoal}
            </p>
            <Badge
              variant={calorieProgress >= 90 && calorieProgress <= 110 ? "default" : "secondary"}
              className="text-xs"
            >
              {calorieProgress}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Average */}
      <Card className="border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t({ ar: "متوسط الأسبوع", fr: "Moyenne Hebdomadaire", en: "Weekly Average" })}
          </CardTitle>
          <TrendingUp className={`h-4 w-4 ${weeklyTrend === "up" ? "text-red-500" : "text-green-500"}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{Math.round(stats.weeklyAverage)}</div>
          <p className="text-xs text-muted-foreground">
            {weeklyTrend === "up"
              ? t({ ar: "فوق الهدف", fr: "Au-dessus de l'objectif", en: "Above target" })
              : t({ ar: "تحت الهدف", fr: "Sous l'objectif", en: "Below target" })}
          </p>
        </CardContent>
      </Card>

      {/* Meals Planned */}
      <Card className="border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t({ ar: "وجبات مخططة", fr: "Repas Planifiés", en: "Meals Planned" })}
          </CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.mealsPlanned}</div>
          <p className="text-xs text-muted-foreground">
            {t({ ar: "هذا الأسبوع", fr: "Cette semaine", en: "This week" })}
          </p>
        </CardContent>
      </Card>

      {/* Traditional Meals */}
      <Card className="border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t({ ar: "وجبات تقليدية", fr: "Repas Traditionnels", en: "Traditional Meals" })}
          </CardTitle>
          <Award className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{stats.traditionalMealsCount}</div>
          <p className="text-xs text-muted-foreground">{t({ ar: "هذا الشهر", fr: "Ce mois", en: "This month" })}</p>
        </CardContent>
      </Card>
    </div>
  )
}
