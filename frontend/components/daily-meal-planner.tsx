"use client"

import { useState, useMemo, useEffect } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { DailyPlan, Meal, MealCategory, NutritionGoals, MealPlanItem } from "@/lib/types/nutrition"
import { getDefaultNutritionGoals } from "@/lib/utils/meal-planning"
import { MealSlot } from "./meal-slot"
import { DailyNutritionSummary } from "./daily-nutrition-summary"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Save, RotateCcw } from "lucide-react"
import { getUserMeals } from "@/lib/actions/meals"

interface DailyMealPlannerProps {
  selectedDate: string
  onSave?: (dailyPlan: DailyPlan) => void
}

export function DailyMealPlanner({ selectedDate, onSave }: DailyMealPlannerProps) {
  const { t } = useLanguage()
  const [items, setItems] = useState({
    breakfast: [] as MealPlanItem[],
    lunch: [] as MealPlanItem[],
    dinner: [] as MealPlanItem[],
    snacks: [] as MealPlanItem[],
  })

  const mealCategories: MealCategory[] = [
    {
      id: "breakfast",
      name_ar: "الإفطار",
      name_fr: "Petit-déjeuner",
      name_en: "Breakfast",
      color: "#f59e0b",
      typical_time: "07:00-09:00",
      description_ar: "وجبة الصباح",
      description_fr: "Repas du matin",
      description_en: "Morning meal",
    },
    {
      id: "lunch",
      name_ar: "الغداء",
      name_fr: "Déjeuner",
      name_en: "Lunch",
      color: "#10b981",
      typical_time: "12:00-14:00",
      description_ar: "وجبة الظهر",
      description_fr: "Repas de midi",
      description_en: "Midday meal",
    },
    {
      id: "dinner",
      name_ar: "العشاء",
      name_fr: "Dîner",
      name_en: "Dinner",
      color: "#3b82f6",
      typical_time: "19:00-21:00",
      description_ar: "وجبة المساء",
      description_fr: "Repas du soir",
      description_en: "Evening meal",
    },
    {
      id: "snacks",
      name_ar: "الوجبات الخفيفة",
      name_fr: "Collations",
      name_en: "Snacks",
      color: "#8b5cf6",
      typical_time: "15:00-17:00",
      description_ar: "وجبات خفيفة",
      description_fr: "Petites collations",
      description_en: "Light snacks",
    },
  ]

  const [availableMeals, setAvailableMeals] = useState<Meal[]>([])
  const [nutritionGoals] = useState<NutritionGoals>(getDefaultNutritionGoals())

  useEffect(() => {
    const loadAvailableMeals = async () => {
      try {
        const result = await getUserMeals()
        if (result.success) {
          setAvailableMeals(result.meals)
        } else {
          console.error("Error loading meals:", result.error)
          setAvailableMeals([])
        }
      } catch (error) {
        console.error("Error loading meals:", error)
        setAvailableMeals([])
      }
    }
    loadAvailableMeals()
  }, [])

  const dailyPlan: DailyPlan = useMemo(() => {
    const basePlan = {
      plan_date: selectedDate,
      meals: items,
      total_calories: 0,
      total_protein: 0,
      total_carbohydrates: 0,
      total_fat: 0,
      total_fiber: 0,
      total_sodium: 0,
    }

    // Calculate totals from actual consumption
    const totals = Object.values(items)
      .flat()
      .reduce(
        (acc, item) => ({
          total_calories: acc.total_calories + item.actual_calories,
          total_protein: acc.total_protein + item.actual_protein,
          total_carbohydrates: acc.total_carbohydrates + item.actual_carbohydrates,
          total_fat: acc.total_fat + item.actual_fat,
          total_fiber: acc.total_fiber + item.actual_fiber,
          total_sodium: acc.total_sodium + item.actual_sodium,
        }),
        {
          total_calories: 0,
          total_protein: 0,
          total_carbohydrates: 0,
          total_fat: 0,
          total_fiber: 0,
          total_sodium: 0,
        },
      )

    return { ...basePlan, ...totals }
  }, [selectedDate, items])

  const handleAddItem = (categoryId: string, item: MealPlanItem) => {
    setItems((prev) => ({
      ...prev,
      [categoryId]: [...(prev[categoryId as keyof typeof prev] || []), item],
    }))
  }

  const handleUpdateItem = (categoryId: string, updatedItem: MealPlanItem) => {
    setItems((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId as keyof typeof prev] || []).map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    }))
  }

  const handleRemoveItem = (categoryId: string, itemId: string) => {
    setItems((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId as keyof typeof prev] || []).filter((item) => item.id !== itemId),
    }))
  }

  const handleSave = () => {
    onSave?.(dailyPlan)
  }

  const handleReset = () => {
    setItems({
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(t({ ar: "ar", fr: "fr", en: "en" }), {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const hasAnyItems = Object.values(items).some((itemList) => itemList.length > 0)

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <span>{formatDate(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              {hasAnyItems && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t({ ar: "إعادة تعيين", fr: "Réinitialiser", en: "Reset" })}
                </Button>
              )}
              <Button onClick={handleSave} disabled={!hasAnyItems} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4 mr-2" />
                {t({ ar: "حفظ الخطة", fr: "Sauvegarder le plan", en: "Save plan" })}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Meal Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mealCategories.map((category) => (
          <MealSlot
            key={category.id}
            mealCategory={category}
            items={dailyPlan.meals[category.id as keyof typeof dailyPlan.meals] || []}
            onAddItem={(item) => handleAddItem(category.id, item)}
            onUpdateItem={(item) => handleUpdateItem(category.id, item)}
            onRemoveItem={(itemId) => handleRemoveItem(category.id, itemId)}
            availableMeals={availableMeals}
          />
        ))}
      </div>

      {/* Daily Nutrition Summary */}
      {hasAnyItems && <DailyNutritionSummary dailyPlan={dailyPlan} goals={nutritionGoals} />}
    </div>
  )
}
