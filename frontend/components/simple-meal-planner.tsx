"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { createClient } from "@/lib/supabase/client"
import type { Meal, Ingredient } from "@/lib/types/nutrition"

interface DayMealItem {
  id: string
  type: "meal" | "ingredient"
  name: string
  quantity: number
  unit: string
  calories: number
}

interface DayMeal {
  id: string
  name: string
  time: string
  items: DayMealItem[]
}

interface DayPlan {
  id: string
  title: string
  meals: DayMeal[]
  totalCalories: number
}

export default function SimpleMealPlanner() {
  const { language } = useLanguage()
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<DayPlan | null>(null)
  const [isCreatingPlan, setIsCreatingPlan] = useState(false)
  const [newPlanTitle, setNewPlanTitle] = useState("")

  const [editingMeal, setEditingMeal] = useState<{ planId: string; mealId: string } | null>(null)
  const [availableMeals, setAvailableMeals] = useState<Meal[]>([])
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [selectedMeal, setSelectedMeal] = useState<string>("")
  const [selectedIngredient, setSelectedIngredient] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [unit, setUnit] = useState<string>("serving")

  useEffect(() => {
    loadMealsAndIngredients()
  }, [])

  const loadMealsAndIngredients = async () => {
    const supabase = createClient()

    try {
      // Load meals
      const { data: meals } = await supabase.from("meals").select(`
          *,
          meal_ingredients (
            *,
            ingredients (*)
          )
        `)

      if (meals) {
        setAvailableMeals(meals)
      }

      // Load ingredients
      const { data: ingredients } = await supabase.from("ingredients").select("*")

      if (ingredients) {
        setAvailableIngredients(ingredients)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const texts = {
    en: {
      title: "Meal Planner",
      addNewDay: "Add New Day Plan",
      createPlan: "Create Day Plan",
      planTitle: "Day Plan Title",
      save: "Save Plan",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      addMeal: "Add Meal",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
      totalCalories: "Total Calories",
      noPlans: "No day plans created yet",
      enterTitle: "Enter plan title (e.g., Bulk v1)",
      editMeal: "Edit Meal",
      addItem: "Add Item",
      selectMeal: "Select Meal",
      selectIngredient: "Select Ingredient",
      addSavedMeal: "Add Saved Meal",
      addIngredient: "Add Ingredient",
      quantity: "Quantity",
      unit: "Unit",
      servings: "servings",
      grams: "grams",
      noItems: "No items added",
      calories: "cal",
    },
    fr: {
      title: "Planificateur de Repas",
      addNewDay: "Ajouter Nouveau Plan",
      createPlan: "Créer Plan de Jour",
      planTitle: "Titre du Plan",
      save: "Sauvegarder",
      cancel: "Annuler",
      edit: "Modifier",
      delete: "Supprimer",
      addMeal: "Ajouter Repas",
      breakfast: "Petit-déjeuner",
      lunch: "Déjeuner",
      dinner: "Dîner",
      snack: "Collation",
      totalCalories: "Calories Totales",
      noPlans: "Aucun plan créé",
      enterTitle: "Entrez le titre (ex: Bulk v1)",
      editMeal: "Modifier Repas",
      addItem: "Ajouter Élément",
      selectMeal: "Sélectionner Repas",
      selectIngredient: "Sélectionner Ingrédient",
      addSavedMeal: "Ajouter Repas Sauvé",
      addIngredient: "Ajouter Ingrédient",
      quantity: "Quantité",
      unit: "Unité",
      servings: "portions",
      grams: "grammes",
      noItems: "Aucun élément ajouté",
      calories: "cal",
    },
    ar: {
      title: "مخطط الوجبات",
      addNewDay: "إضافة خطة يوم جديد",
      createPlan: "إنشاء خطة يوم",
      planTitle: "عنوان الخطة",
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      addMeal: "إضافة وجبة",
      breakfast: "الإفطار",
      lunch: "الغداء",
      dinner: "العشاء",
      snack: "وجبة خفيفة",
      totalCalories: "إجمالي السعرات",
      noPlans: "لم يتم إنشاء خطط بعد",
      enterTitle: "أدخل العنوان (مثل: Bulk v1)",
      editMeal: "تعديل الوجبة",
      addItem: "إضافة عنصر",
      selectMeal: "اختر وجبة",
      selectIngredient: "اختر مكون",
      addSavedMeal: "إضافة وجبة محفوظة",
      addIngredient: "إضافة مكون",
      quantity: "الكمية",
      unit: "الوحدة",
      servings: "حصص",
      grams: "جرام",
      noItems: "لم تتم إضافة عناصر",
      calories: "سعرة",
    },
  }

  const t = texts[language] || texts.en

  const createNewPlan = () => {
    if (!newPlanTitle.trim()) return

    const newPlan: DayPlan = {
      id: Date.now().toString(),
      title: newPlanTitle,
      meals: [
        { id: "1", name: t.breakfast, time: "08:00", items: [] },
        { id: "2", name: t.lunch, time: "12:00", items: [] },
        { id: "3", name: t.dinner, time: "18:00", items: [] },
      ],
      totalCalories: 0,
    }

    setDayPlans([...dayPlans, newPlan])
    setCurrentPlan(newPlan)
    setIsCreatingPlan(false)
    setNewPlanTitle("")
  }

  const addMealToPlan = (planId: string) => {
    const plan = dayPlans.find((p) => p.id === planId)
    if (!plan) return

    const newMeal: DayMeal = {
      id: Date.now().toString(),
      name: `${t.snack} ${plan.meals.length + 1}`,
      time: "15:00",
      items: [],
    }

    const updatedPlan = {
      ...plan,
      meals: [...plan.meals, newMeal],
    }

    setDayPlans(dayPlans.map((p) => (p.id === planId ? updatedPlan : p)))
    if (currentPlan?.id === planId) {
      setCurrentPlan(updatedPlan)
    }
  }

  const deletePlan = (planId: string) => {
    setDayPlans(dayPlans.filter((p) => p.id !== planId))
    if (currentPlan?.id === planId) {
      setCurrentPlan(null)
    }
  }

  const addSavedMealToDay = (planId: string, mealId: string) => {
    const meal = availableMeals.find((m) => m.id === selectedMeal)
    if (!meal) return

    const newItem: DayMealItem = {
      id: Date.now().toString(),
      type: "meal",
      name: meal.name_en || meal.name_fr || meal.name_ar || "Unknown Meal",
      quantity: quantity,
      unit: unit,
      calories: Math.round(((meal.total_calories || 0) * quantity) / (meal.servings || 1)),
    }

    addItemToDayMeal(planId, mealId, newItem)
    resetSelection()
  }

  const addIngredientToDay = (planId: string, mealId: string) => {
    const ingredient = availableIngredients.find((i) => i.id === selectedIngredient)
    if (!ingredient) return

    const caloriesPerUnit =
      unit === "grams"
        ? ((ingredient.calories_per_100g || 0) * quantity) / 100
        : ((ingredient.calories_per_100g || 0) * quantity) / 10 // rough estimate for servings

    const newItem: DayMealItem = {
      id: Date.now().toString(),
      type: "ingredient",
      name: ingredient.name_en || ingredient.name_fr || ingredient.name_ar || "Unknown Ingredient",
      quantity: quantity,
      unit: unit,
      calories: Math.round(caloriesPerUnit),
    }

    addItemToDayMeal(planId, mealId, newItem)
    resetSelection()
  }

  const addItemToDayMeal = (planId: string, mealId: string, item: DayMealItem) => {
    setDayPlans((plans) =>
      plans.map((plan) => {
        if (plan.id !== planId) return plan

        return {
          ...plan,
          meals: plan.meals.map((meal) => {
            if (meal.id !== mealId) return meal
            return {
              ...meal,
              items: [...meal.items, item],
            }
          }),
          totalCalories: plan.totalCalories + item.calories,
        }
      }),
    )
  }

  const removeItemFromDayMeal = (planId: string, mealId: string, itemId: string) => {
    setDayPlans((plans) =>
      plans.map((plan) => {
        if (plan.id !== planId) return plan

        const meal = plan.meals.find((m) => m.id === mealId)
        const item = meal?.items.find((i) => i.id === itemId)
        const caloriesLost = item?.calories || 0

        return {
          ...plan,
          meals: plan.meals.map((meal) => {
            if (meal.id !== mealId) return meal
            return {
              ...meal,
              items: meal.items.filter((item) => item.id !== itemId),
            }
          }),
          totalCalories: Math.max(0, plan.totalCalories - caloriesLost),
        }
      }),
    )
  }

  const resetSelection = () => {
    setSelectedMeal("")
    setSelectedIngredient("")
    setQuantity(1)
    setUnit("serving")
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>

        {/* Add New Day Plan Button */}
        <Button
          onClick={() => setIsCreatingPlan(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-lg"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t.addNewDay}
        </Button>
      </div>

      {/* Create New Plan Form */}
      {isCreatingPlan && (
        <Card className="mb-6 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-700">{t.createPlan}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.planTitle}</label>
                <Input
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                  placeholder={t.enterTitle}
                  className="border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <Button
                onClick={createNewPlan}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!newPlanTitle.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </Button>
              <Button
                onClick={() => {
                  setIsCreatingPlan(false)
                  setNewPlanTitle("")
                }}
                variant="outline"
                className="border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day Plans List */}
      {dayPlans.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 text-lg">{t.noPlans}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {dayPlans.map((plan) => (
            <Card key={plan.id} className="border-2 border-gray-200 hover:border-emerald-300 transition-colors">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-emerald-700">{plan.title}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {t.totalCalories}: {plan.totalCalories}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addMealToPlan(plan.id)}
                      variant="outline"
                      size="sm"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t.addMeal}
                    </Button>
                    <Button
                      onClick={() => setCurrentPlan(plan)}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {t.edit}
                    </Button>
                    <Button
                      onClick={() => deletePlan(plan.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.delete}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {plan.meals.map((meal) => (
                    <Card key={meal.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg text-gray-800">{meal.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {meal.time}
                            </Badge>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-transparent"
                                  onClick={() => setEditingMeal({ planId: plan.id, mealId: meal.id })}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>
                                    {t.editMeal}: {meal.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {/* Add Saved Meal Section */}
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-emerald-700">{t.addSavedMeal}</h4>
                                    <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t.selectMeal} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableMeals.map((meal) => (
                                          <SelectItem key={meal.id} value={meal.id}>
                                            {meal.name_en || meal.name_fr || meal.name_ar}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        placeholder={t.quantity}
                                        min="0.1"
                                        step="0.1"
                                        className="flex-1"
                                      />
                                      <Select value={unit} onValueChange={setUnit}>
                                        <SelectTrigger className="w-24">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="serving">{t.servings}</SelectItem>
                                          <SelectItem value="grams">{t.grams}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      onClick={() => addSavedMealToDay(plan.id, meal.id)}
                                      disabled={!selectedMeal}
                                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                                      size="sm"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      {t.addSavedMeal}
                                    </Button>
                                  </div>

                                  {/* Add Ingredient Section */}
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-blue-700">{t.addIngredient}</h4>
                                    <Select value={selectedIngredient} onValueChange={setSelectedIngredient}>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t.selectIngredient} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableIngredients.map((ingredient) => (
                                          <SelectItem key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name_en || ingredient.name_fr || ingredient.name_ar}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <div className="flex gap-2">
                                      <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        placeholder={t.quantity}
                                        min="0.1"
                                        step="0.1"
                                        className="flex-1"
                                      />
                                      <Select value={unit} onValueChange={setUnit}>
                                        <SelectTrigger className="w-24">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="grams">{t.grams}</SelectItem>
                                          <SelectItem value="serving">{t.servings}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      onClick={() => addIngredientToDay(plan.id, meal.id)}
                                      disabled={!selectedIngredient}
                                      className="w-full bg-blue-600 hover:bg-blue-700"
                                      size="sm"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      {t.addIngredient}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {meal.items.length === 0 ? (
                          <p className="text-gray-500 text-sm">{t.noItems}</p>
                        ) : (
                          <div className="space-y-2">
                            {meal.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                              >
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <div className="text-xs text-gray-500">
                                    {item.quantity} {item.unit}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {item.calories} {t.calories}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 w-6 p-0 border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                                    onClick={() => removeItemFromDayMeal(plan.id, meal.id, item.id)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
