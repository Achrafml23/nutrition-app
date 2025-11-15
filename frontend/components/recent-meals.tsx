"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import type { Meal } from "@/lib/types/nutrition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, Award, Plus } from "lucide-react"
import Link from "next/link"

interface RecentMealsProps {
  recentMeals: (Meal & { created_at?: string })[]
  favoriteMeals: Meal[]
}

export function RecentMeals({ recentMeals, favoriteMeals }: RecentMealsProps) {
  const { t } = useLanguage()

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return t({ ar: "منذ قليل", fr: "À l'instant", en: "Just now" })
    if (diffInHours < 24) return `${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Meals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            {t({ ar: "الوجبات الأخيرة", fr: "Repas Récents", en: "Recent Meals" })}
          </CardTitle>
          <Link href="/meal-builder">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t({ ar: "جديد", fr: "Nouveau", en: "New" })}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentMeals.length > 0 ? (
            <div className="space-y-3">
              {recentMeals.slice(0, 4).map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{meal.name}</h4>
                      {meal.is_traditional && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{Math.round(meal.total_calories)} cal</span>
                      <span>{meal.total_protein.toFixed(1)}g protein</span>
                      {meal.created_at && <span>{formatTimeAgo(meal.created_at)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">
                {t({
                  ar: "لم تقم بإنشاء وجبات بعد",
                  fr: "Aucun repas créé encore",
                  en: "No meals created yet",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favorite Meals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            {t({ ar: "الوجبات المفضلة", fr: "Repas Favoris", en: "Favorite Meals" })}
          </CardTitle>
          <Link href="/meal-planner">
            <Button variant="outline" size="sm">
              {t({ ar: "خطط", fr: "Planifier", en: "Plan" })}
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {favoriteMeals.length > 0 ? (
            <div className="space-y-3">
              {favoriteMeals.slice(0, 4).map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{meal.name}</h4>
                      <Heart className="h-3 w-3 text-red-500 fill-current" />
                      {meal.is_traditional && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{Math.round(meal.total_calories)} cal</span>
                      <span>{meal.total_protein.toFixed(1)}g protein</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">
                {t({
                  ar: "لا توجد وجبات مفضلة بعد",
                  fr: "Aucun repas favori encore",
                  en: "No favorite meals yet",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
