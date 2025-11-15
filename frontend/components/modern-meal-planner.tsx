"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Plus, Utensils, Coffee, Sun, Moon, Cookie, Trash2, Edit3 } from "lucide-react"
import { IngredientSelectorWithQuantity } from "./ingredient-selector-with-quantity"
import { MealSelectorWithQuantity } from "./meal-selector-with-quantity"
import { getUserMeals } from "@/lib/actions/meals"
import { createClient } from "@/lib/supabase/client"
import type { MealPlanItem, Meal, Ingredient } from "@/lib/types/nutrition"

interface MealSlot {
  id: string
  name_ar: string
  name_fr: string
  name_en: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  time: string
  items: MealPlanItem[]
}

const MEAL_CATEGORIES: MealSlot[] = [
  {
    id: "breakfast",
    name_ar: "الإفطار",
    name_fr: "Petit-déjeuner",
    name_en: "Breakfast",
    icon: Coffee,
    color: "bg-amber-50 border-amber-200 text-amber-800",
    time: "7:00 - 9:00",
    items: [],
  },
  {
    id: "lunch",
    name_ar: "الغداء",
    name_fr: "Déjeuner",
    name_en: "Lunch",
    icon: Sun,
    color: "bg-orange-50 border-orange-200 text-orange-800",
    time: "12:00 - 14:00",
    items: [],
  },
  {
    id: "dinner",
    name_ar: "العشاء",
    name_fr: "Dîner",
    name_en: "Dinner",
    icon: Moon,
    color: "bg-purple-50 border-purple-200 text-purple-800",
    time: "19:00 - 21:00",
    items: [],
  },
  {
    id: "snacks",
    name_ar: "الوجبات الخفيفة",
    name_fr: "Collations",
    name_en: "Snacks",
    icon: Cookie,
    color: "bg-green-50 border-green-200 text-green-800",
    time: "Anytime",
    items: [],
  },
]

export function ModernMealPlanner() {
  const { language, secondLanguage, t } = useLanguage()
  const [mealSlots, setMealSlots] = useState<MealSlot[]>(MEAL_CATEGORIES)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [availableMeals, setAvailableMeals] = useState<Meal[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        const mealsResult = await getUserMeals()
        if (mealsResult.success) {
          setAvailableMeals(mealsResult.meals)
        }

        const supabase = createClient()
        const { data: ingredients, error } = await supabase.from("ingredients").select("*").order("name_en")

        if (!error && ingredients) {
          setAvailableIngredients(ingredients)
        }
      } catch (error) {
        console.error("Error loading meal planner data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const dailyTotals = useMemo(() => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalFiber = 0

    mealSlots.forEach((slot) => {
      slot.items.forEach((item) => {
        if (item.type === "meal" && item.meal) {
          const multiplier =
            item.consumption_unit === "grams"
              ? item.consumption_amount / (item.meal.total_weight || 100)
              : item.consumption_amount / item.meal.servings

          totalCalories += (item.meal.total_calories || 0) * multiplier
          totalProtein += (item.meal.total_protein || 0) * multiplier
          totalCarbs += (item.meal.total_carbs || 0) * multiplier
          totalFat += (item.meal.total_fat || 0) * multiplier
          totalFiber += (item.meal.total_fiber || 0) * multiplier
        } else if (item.type === "ingredient" && item.ingredient) {
          const gramsConsumed = item.consumption_amount
          const per100g = item.ingredient

          totalCalories += ((per100g.calories_per_100g || 0) * gramsConsumed) / 100
          totalProtein += ((per100g.protein_per_100g || 0) * gramsConsumed) / 100
          totalCarbs += ((per100g.carbs_per_100g || 0) * gramsConsumed) / 100
          totalFat += ((per100g.fat_per_100g || 0) * gramsConsumed) / 100
          totalFiber += ((per100g.fiber_per_100g || 0) * gramsConsumed) / 100
        }
      })
    })

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      fiber: Math.round(totalFiber),
    }
  }, [mealSlots])

  const addItemToSlot = (slotId: string, item: MealPlanItem) => {
    setMealSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, items: [...slot.items, { ...item, id: Date.now().toString() }] } : slot,
      ),
    )
  }

  const removeItemFromSlot = (slotId: string, itemId: string) => {
    setMealSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, items: slot.items.filter((item) => item.id !== itemId) } : slot,
      ),
    )
  }

  const updateItemConsumption = (slotId: string, itemId: string, amount: number) => {
    setMealSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              items: slot.items.map((item) => (item.id === itemId ? { ...item, consumption_amount: amount } : item)),
            }
          : slot,
      ),
    )
  }

  const getDisplayName = (item: { name_ar: string; name_fr: string; name_en: string }) => {
    const primaryName = item[`name_${language}` as keyof typeof item] || item.name_en
    const secondaryName =
      secondLanguage && secondLanguage !== language ? item[`name_${secondLanguage}` as keyof typeof item] : null

    return { primaryName, secondaryName }
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t("مخطط الوجبات", "Planificateur de repas", "Meal Planner")}
        </h1>
        <p className="text-muted-foreground">
          {t("خطط وجباتك اليومية", "Planifiez vos repas quotidiens", "Plan your daily meals")}
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Utensils className="h-5 w-5" />
            {t("ملخص التغذية اليومية", "Résumé nutritionnel quotidien", "Daily Nutrition Summary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{dailyTotals.calories}</div>
              <div className="text-sm text-muted-foreground">{t("سعرة حرارية", "Calories", "Calories")}</div>
              <Progress value={Math.min((dailyTotals.calories / 2000) * 100, 100)} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2">{dailyTotals.protein}g</div>
              <div className="text-sm text-muted-foreground">{t("بروتين", "Protéines", "Protein")}</div>
              <Progress value={Math.min((dailyTotals.protein / 150) * 100, 100)} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">{dailyTotals.carbs}g</div>
              <div className="text-sm text-muted-foreground">{t("كربوهيدرات", "Glucides", "Carbs")}</div>
              <Progress value={Math.min((dailyTotals.carbs / 250) * 100, 100)} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-4">{dailyTotals.fat}g</div>
              <div className="text-sm text-muted-foreground">{t("دهون", "Lipides", "Fat")}</div>
              <Progress value={Math.min((dailyTotals.fat / 65) * 100, 100)} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-5">{dailyTotals.fiber}g</div>
              <div className="text-sm text-muted-foreground">{t("ألياف", "Fibres", "Fiber")}</div>
              <Progress value={Math.min((dailyTotals.fiber / 25) * 100, 100)} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mealSlots.map((slot) => {
          const { primaryName } = getDisplayName(slot)
          const Icon = slot.icon

          return (
            <Card key={slot.id} className={`${slot.color} transition-all duration-200 hover:shadow-lg`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-lg">{primaryName}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {slot.time}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 min-h-[120px]">
                  {slot.items.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t("لا توجد عناصر", "Aucun élément", "No items")}</p>
                    </div>
                  ) : (
                    slot.items.map((item) => {
                      const itemName =
                        item.type === "meal" && item.meal
                          ? getDisplayName(item.meal).primaryName
                          : item.type === "ingredient" && item.ingredient
                            ? getDisplayName(item.ingredient).primaryName
                            : "Unknown"

                      return (
                        <div key={item.id} className="bg-card rounded-lg p-3 border border-border/50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-card-foreground">{itemName}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.consumption_amount}{" "}
                                {item.consumption_unit === "grams" ? "g" : t("حصة", "portion", "serving")}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newAmount = prompt(
                                    t("أدخل الكمية الجديدة", "Entrez la nouvelle quantité", "Enter new amount"),
                                    item.consumption_amount.toString(),
                                  )
                                  if (newAmount && !isNaN(Number(newAmount))) {
                                    updateItemConsumption(slot.id, item.id, Number(newAmount))
                                  }
                                }}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => removeItemFromSlot(slot.id, item.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                <Separator />

                <div className="flex gap-2">
                  <MealSelectorWithQuantity
                    availableMeals={availableMeals}
                    onSelect={(meal, amount, unit) => {
                      addItemToSlot(slot.id, {
                        id: "",
                        type: "meal",
                        meal,
                        consumption_amount: amount,
                        consumption_unit: unit,
                        consumption_percentage: 100,
                      })
                    }}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={isLoading}>
                        <Plus className="h-3 w-3 mr-1" />
                        {t("وجبة", "Repas", "Meal")}
                      </Button>
                    }
                  />
                  <IngredientSelectorWithQuantity
                    availableIngredients={availableIngredients}
                    onSelect={(ingredient, amount, unit) => {
                      addItemToSlot(slot.id, {
                        id: "",
                        type: "ingredient",
                        ingredient,
                        consumption_amount: amount,
                        consumption_unit: "grams",
                        consumption_percentage: 100,
                      })
                    }}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={isLoading}>
                        <Plus className="h-3 w-3 mr-1" />
                        {t("مكون", "Ingrédient", "Ingredient")}
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
