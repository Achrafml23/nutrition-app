"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { DayPlan, DayMeal, DayMealItem, Meal, Ingredient, Day } from "@/lib/types/nutrition"
import { MEAL_TYPE_SUGGESTIONS, getRandomMealColor } from "@/lib/utils/day-meal-suggestions"
import { getUserMeals } from "@/lib/actions/meals"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Clock, Utensils, Apple, Save, FolderOpen, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MealSelectorWithQuantity } from "./meal-selector-with-quantity"
import { IngredientSelectorWithQuantity } from "./ingredient-selector-with-quantity"
import { saveDayPlan, getSavedDays, deleteSavedDay } from "@/lib/actions/days"

export function FlexibleMealPlanner() {
  const { language, secondLanguage, t } = useLanguage()

  const [currentDay, setCurrentDay] = useState<Day | null>(null)
  const [savedDays, setSavedDays] = useState<Day[]>([])
  const [dayTitle, setDayTitle] = useState("")
  const [dayDescription, setDayDescription] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)

  const [dayPlan, setDayPlan] = useState<DayPlan>({
    date: new Date().toISOString().split("T")[0],
    day_meals: [],
    total_nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
    },
    daily_goals: {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 65,
      fiber: 25,
      sodium: 2300,
    },
  })

  const [availableMeals, setAvailableMeals] = useState<Meal[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [isAddingMeal, setIsAddingMeal] = useState(false)

  // Load available meals and ingredients
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load meals
        const mealsResult = await getUserMeals()
        if (mealsResult.success) {
          setAvailableMeals(mealsResult.meals)
        }

        // Load ingredients
        const supabase = createClient()
        const { data: ingredients } = await supabase.from("ingredients").select("*").limit(100)

        if (ingredients) {
          setAvailableIngredients(ingredients)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const loadSavedDays = async () => {
      const result = await getSavedDays()
      if (result.success) {
        setSavedDays(result.days)
      }
    }
    loadSavedDays()
  }, [])

  const addDayMeal = (suggestion?: (typeof MEAL_TYPE_SUGGESTIONS)[0], customName?: string) => {
    const newDayMeal: DayMeal = {
      id: `day-meal-${Date.now()}`,
      name: customName || suggestion?.name_en || "Custom Meal",
      time: suggestion?.typical_time,
      color: suggestion?.color || getRandomMealColor(),
      items: [],
      notes: "",
    }

    setDayPlan((prev) => ({
      ...prev,
      day_meals: [...prev.day_meals, newDayMeal],
    }))
    setIsAddingMeal(false)
  }

  const removeDayMeal = (dayMealId: string) => {
    setDayPlan((prev) => ({
      ...prev,
      day_meals: prev.day_meals.filter((dm) => dm.id !== dayMealId),
    }))
  }

  const addItemToDayMeal = (dayMealId: string, item: DayMealItem) => {
    setDayPlan((prev) => ({
      ...prev,
      day_meals: prev.day_meals.map((dm) =>
        dm.id === dayMealId
          ? {
              ...dm,
              items: [
                ...dm.items,
                {
                  ...item,
                  id: `item-${Date.now()}`,
                  // Ensure meal/ingredient data is properly attached
                  meal: item.type === "meal" ? item.meal : undefined,
                  ingredient: item.type === "ingredient" ? item.ingredient : undefined,
                },
              ],
            }
          : dm,
      ),
    }))
  }

  const removeItemFromDayMeal = (dayMealId: string, itemId: string) => {
    setDayPlan((prev) => ({
      ...prev,
      day_meals: prev.day_meals.map((dm) =>
        dm.id === dayMealId ? { ...dm, items: dm.items.filter((item) => item.id !== itemId) } : dm,
      ),
    }))
  }

  const updateDayMealName = (dayMealId: string, newName: string) => {
    setDayPlan((prev) => ({
      ...prev,
      day_meals: prev.day_meals.map((dm) => (dm.id === dayMealId ? { ...dm, name: newName } : dm)),
    }))
  }

  const handleSaveDay = async () => {
    if (!dayTitle.trim()) return

    const result = await saveDayPlan(dayTitle, dayDescription, dayPlan)
    if (result.success) {
      setCurrentDay(result.day)
      setShowSaveDialog(false)
      // Refresh saved days list
      const savedResult = await getSavedDays()
      if (savedResult.success) {
        setSavedDays(savedResult.days)
      }
    }
  }

  const handleLoadDay = (day: Day) => {
    setCurrentDay(day)
    setDayPlan(day.day_plan)
    setDayTitle(day.title)
    setDayDescription(day.description || "")
    setShowLoadDialog(false)
  }

  const handleDeleteDay = async (dayId: string) => {
    const result = await deleteSavedDay(dayId)
    if (result.success) {
      setSavedDays((prev) => prev.filter((d) => d.id !== dayId))
      if (currentDay?.id === dayId) {
        setCurrentDay(null)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("مخطط الوجبات / Planificateur de repas / Meal Planner")}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentDay
              ? `${currentDay.title} - ${currentDay.description}`
              : t("خطط وجباتك اليومية / Planifiez vos repas quotidiens / Plan your daily meals")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowLoadDialog(true)}>
            <FolderOpen className="w-4 h-4 mr-2" />
            {t("تحميل / Charger / Load")}
          </Button>

          <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
            <Save className="w-4 h-4 mr-2" />
            {t("حفظ / Sauvegarder / Save")}
          </Button>

          <Input
            type="date"
            value={dayPlan.date}
            onChange={(e) => setDayPlan((prev) => ({ ...prev, date: e.target.value }))}
            className="w-40"
          />
        </div>
      </div>

      {/* Day Meals */}
      <div className="grid gap-6">
        {dayPlan.day_meals.map((dayMeal) => (
          <Card key={dayMeal.id} className="border-l-4" style={{ borderLeftColor: dayMeal.color.replace("bg-", "") }}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${dayMeal.color}`} />
                  <Input
                    value={dayMeal.name}
                    onChange={(e) => updateDayMealName(dayMeal.id, e.target.value)}
                    className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                  />
                  {dayMeal.time && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dayMeal.time}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDayMeal(dayMeal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Day Meal Items */}
              <div className="space-y-2">
                {dayMeal.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.type === "meal" ? (
                        <Utensils className="w-4 h-4 text-green-600" />
                      ) : (
                        <Apple className="w-4 h-4 text-orange-600" />
                      )}

                      <div>
                        <p className="font-medium">
                          {item.type === "meal"
                            ? item.meal?.name_en || "Unknown Meal"
                            : item.ingredient?.name_en || "Unknown Ingredient"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItemFromDayMeal(dayMeal.id, item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add Items */}
              <div className="flex gap-2">
                <MealSelectorWithQuantity
                  availableMeals={availableMeals}
                  onSelect={(meal, quantity, unit) => {
                    addItemToDayMeal(dayMeal.id, {
                      id: "",
                      type: "meal",
                      meal,
                      meal_id: meal.id,
                      quantity,
                      unit,
                    })
                  }}
                  trigger={
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Utensils className="w-4 h-4" />
                      {t("إضافة وجبة / Ajouter repas / Add Meal")}
                    </Button>
                  }
                />

                <IngredientSelectorWithQuantity
                  onSelect={(ingredient, quantity, unit) => {
                    addItemToDayMeal(dayMeal.id, {
                      id: "",
                      type: "ingredient",
                      ingredient,
                      ingredient_id: ingredient.id,
                      quantity,
                      unit,
                    })
                  }}
                  trigger={
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Apple className="w-4 h-4" />
                      {t("إضافة مكون / Ajouter ingrédient / Add Ingredient")}
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Day Meal */}
      <Dialog open={isAddingMeal} onOpenChange={setIsAddingMeal}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            {t("إضافة وجبة يومية / Ajouter repas quotidien / Add Day Meal")}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("إضافة وجبة يومية جديدة / Ajouter nouveau repas / Add New Day Meal")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">{t("اقتراحات الوجبات / Suggestions de repas / Meal Suggestions")}</h3>
              <div className="grid grid-cols-2 gap-3">
                {MEAL_TYPE_SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => addDayMeal(suggestion)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${suggestion.color}`} />
                      <div className="text-left">
                        <p className="font-medium">
                          {language === "ar"
                            ? suggestion.name_ar
                            : language === "fr"
                              ? suggestion.name_fr
                              : suggestion.name_en}
                        </p>
                        {suggestion.typical_time && <p className="text-sm text-gray-500">{suggestion.typical_time}</p>}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">{t("وجبة مخصصة / Repas personnalisé / Custom Meal")}</h3>
              <div className="flex gap-2">
                <Input
                  placeholder={t("اسم الوجبة / Nom du repas / Meal name")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const target = e.target as HTMLInputElement
                      if (target.value.trim()) {
                        addDayMeal(undefined, target.value.trim())
                        target.value = ""
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Meal name"]') as HTMLInputElement
                    if (input?.value.trim()) {
                      addDayMeal(undefined, input.value.trim())
                      input.value = ""
                    }
                  }}
                >
                  {t("إضافة / Ajouter / Add")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("حفظ خطة اليوم / Sauvegarder plan / Save Day Plan")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={t("عنوان الخطة / Titre du plan / Plan Title")}
              value={dayTitle}
              onChange={(e) => setDayTitle(e.target.value)}
            />
            <Input
              placeholder={t("وصف الخطة / Description / Description")}
              value={dayDescription}
              onChange={(e) => setDayDescription(e.target.value)}
            />
            <Button onClick={handleSaveDay} disabled={!dayTitle.trim()}>
              {t("حفظ / Sauvegarder / Save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("تحميل خطة محفوظة / Charger plan / Load Saved Plan")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedDays.map((day) => (
              <div key={day.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 cursor-pointer" onClick={() => handleLoadDay(day)}>
                  <h3 className="font-medium">{day.title}</h3>
                  <p className="text-sm text-gray-600">{day.description}</p>
                  <p className="text-xs text-gray-500">
                    {day.day_plan.day_meals.length} meals • {new Date(day.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDay(day.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
