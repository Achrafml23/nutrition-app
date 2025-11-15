"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Meal } from "@/lib/types/nutrition"
import { calculateGramsPerServing } from "@/lib/utils/meal-calculations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Utensils, Scale } from "lucide-react"

interface MealSelectorWithQuantityProps {
  availableMeals?: Meal[]
  onSelect: (meal: Meal, amount: number, unit: "servings" | "grams") => void
  trigger?: React.ReactNode
}

export function MealSelectorWithQuantity({ availableMeals = [], onSelect, trigger }: MealSelectorWithQuantityProps) {
  const { t } = useLanguage()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [amount, setAmount] = useState("1")
  const [unit, setUnit] = useState<"servings" | "grams">("servings")
  const [open, setOpen] = useState(false)

  const handleAddMeal = () => {
    if (selectedMeal && amount) {
      const numAmount = Number.parseFloat(amount)
      if (numAmount > 0) {
        onSelect(selectedMeal, numAmount, unit)
        setSelectedMeal(null)
        setAmount("1")
        setUnit("servings")
        setOpen(false)
      }
    }
  }

  const content = (
    <div className="space-y-4">
      {/* Meal Selection */}
      <div className="space-y-3">
        <h4 className="font-medium">
          {t({
            ar: "اختر الوجبة",
            fr: "Sélectionner le repas",
            en: "Select Meal",
          })}
        </h4>

        {availableMeals && availableMeals.length > 0 ? (
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {availableMeals.map((meal) => {
              const gramsPerServing = calculateGramsPerServing(meal)

              return (
                <div
                  key={meal.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMeal?.id === meal.id ? "border-emerald-500 bg-emerald-50" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedMeal(meal)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{meal.name}</h5>
                      {meal.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{meal.description}</p>
                      )}

                      <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                        <span>{Math.round(meal.total_calories)} cal</span>
                        <span>{meal.total_protein.toFixed(1)}g protein</span>
                        <span>
                          {meal.servings} {t({ ar: "حصص", fr: "portions", en: "servings" })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        <Scale className="h-3 w-3" />
                        <span className="font-medium">
                          {gramsPerServing}g/{t({ ar: "حصة", fr: "portion", en: "serving" })}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        {meal.is_traditional && (
                          <Badge variant="secondary" className="text-xs">
                            {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
                          </Badge>
                        )}
                        {meal.is_favorite && (
                          <Badge variant="outline" className="text-xs">
                            {t({ ar: "مفضل", fr: "Favori", en: "Favorite" })}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedMeal?.id === meal.id && <div className="w-2 h-2 bg-emerald-500 rounded-full ml-2 mt-1" />}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Utensils className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">
              {t({
                ar: "لا توجد وجبات متاحة",
                fr: "Aucun repas disponible",
                en: "No meals available",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Quantity and Unit Selection */}
      {selectedMeal && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm">
            {t({
              ar: "حدد الكمية",
              fr: "Spécifier la quantité",
              en: "Specify Quantity",
            })}
          </h4>

          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1"
                min="0.1"
                step="0.1"
                className="text-center"
              />
            </div>

            <div className="flex-1">
              <Select value={unit} onValueChange={(value: "servings" | "grams") => setUnit(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="servings">{t({ ar: "حصص", fr: "Portions", en: "Servings" })}</SelectItem>
                  <SelectItem value="grams">{t({ ar: "جرام", fr: "Grammes", en: "Grams" })}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {unit === "servings" ? (
              <div>
                <span className="font-medium">
                  {Number.parseFloat(amount) || 0} {t({ ar: "حصة", fr: "portion(s)", en: "serving(s)" })}
                </span>
                <div className="mt-1 text-emerald-600">
                  ≈ {Math.round(calculateGramsPerServing(selectedMeal) * (Number.parseFloat(amount) || 0))}g total
                </div>
                <div className="mt-1">
                  ~
                  {Math.round((selectedMeal.total_calories / selectedMeal.servings) * (Number.parseFloat(amount) || 0))}{" "}
                  cal,{" "}
                  {((selectedMeal.total_protein / selectedMeal.servings) * (Number.parseFloat(amount) || 0)).toFixed(1)}
                  g protein
                </div>
              </div>
            ) : (
              <div>
                <span className="font-medium">{Number.parseFloat(amount) || 0}g</span>
                <div className="mt-1 text-emerald-600">
                  ≈ {((Number.parseFloat(amount) || 0) / calculateGramsPerServing(selectedMeal)).toFixed(2)}{" "}
                  {t({ ar: "حصة", fr: "portions", en: "servings" })}
                </div>
                <div className="mt-1">
                  ~
                  {Math.round(
                    (selectedMeal.total_calories / (calculateGramsPerServing(selectedMeal) * selectedMeal.servings)) *
                      (Number.parseFloat(amount) || 0),
                  )}{" "}
                  cal,{" "}
                  {(
                    (selectedMeal.total_protein / (calculateGramsPerServing(selectedMeal) * selectedMeal.servings)) *
                    (Number.parseFloat(amount) || 0)
                  ).toFixed(1)}
                  g protein
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleAddMeal}
            className="w-full"
            disabled={!selectedMeal || !amount || Number.parseFloat(amount) <= 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t({
              ar: "إضافة الوجبة",
              fr: "Ajouter le repas",
              en: "Add Meal",
            })}
          </Button>
        </div>
      )}
    </div>
  )

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t({
                ar: "إضافة وجبة",
                fr: "Ajouter un repas",
                en: "Add Meal",
              })}
            </DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return content
}
