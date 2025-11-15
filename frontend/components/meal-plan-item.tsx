"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { MealPlanItem as MealPlanItemType, Ingredient } from "@/lib/types/nutrition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Edit2, Check, Utensils, Apple } from "lucide-react"

interface MealPlanItemProps {
  item: MealPlanItemType
  onUpdate: (item: MealPlanItemType) => void
  onRemove: (itemId: string) => void
}

export function MealPlanItem({ item, onUpdate, onRemove }: MealPlanItemProps) {
  const { t, language, secondLanguage } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [consumptionAmount, setConsumptionAmount] = useState(item.consumption_amount.toString())

  const handleSaveConsumption = () => {
    const newAmount = Number.parseFloat(consumptionAmount) || 0
    let percentage: number
    let multiplier: number

    if (item.type === "meal") {
      if (item.consumption_unit === "grams") {
        const estimatedTotalGrams = (item.meal?.total_calories || 0) * 2.5
        multiplier = newAmount / estimatedTotalGrams
        percentage = multiplier * 100
      } else {
        // Serving-based consumption
        multiplier = newAmount / (item.meal?.servings || 1)
        percentage = multiplier * 100
      }
    } else {
      // Ingredient - always gram-based
      multiplier = newAmount / 100
      percentage = multiplier * 100
    }

    const updatedItem: MealPlanItemType = {
      ...item,
      consumption_amount: newAmount,
      consumption_percentage: percentage,
      actual_calories:
        (item.type === "meal" ? item.meal?.total_calories || 0 : item.ingredient?.calories_per_100g || 0) * multiplier,
      actual_protein:
        (item.type === "meal" ? item.meal?.total_protein || 0 : item.ingredient?.protein_per_100g || 0) * multiplier,
      actual_carbohydrates:
        (item.type === "meal" ? item.meal?.total_carbohydrates || 0 : item.ingredient?.carbohydrates_per_100g || 0) *
        multiplier,
      actual_fat: (item.type === "meal" ? item.meal?.total_fat || 0 : item.ingredient?.fat_per_100g || 0) * multiplier,
      actual_fiber:
        (item.type === "meal" ? item.meal?.total_fiber || 0 : item.ingredient?.fiber_per_100g || 0) * multiplier,
      actual_sodium:
        (item.type === "meal" ? item.meal?.total_sodium || 0 : item.ingredient?.sodium_per_100g || 0) * multiplier,
    }

    onUpdate(updatedItem)
    setIsEditing(false)
  }

  const getItemName = () => {
    if (item.type === "meal") {
      return item.meal?.name || ""
    } else {
      const ingredient = item.ingredient as Ingredient
      const primaryName = (ingredient?.[`name_${language}` as keyof Ingredient] as string) || ""
      const secondaryName =
        secondLanguage && secondLanguage !== language
          ? (ingredient?.[`name_${secondLanguage}` as keyof Ingredient] as string) || ""
          : ""

      return (
        <div>
          <span>{primaryName}</span>
          {secondaryName && secondaryName !== primaryName && (
            <div className="text-xs text-emerald-600 font-medium">{secondaryName}</div>
          )}
        </div>
      )
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0">
          {item.type === "meal" ? (
            <Utensils className="h-4 w-4 text-blue-600" />
          ) : (
            <Apple className="h-4 w-4 text-green-600" />
          )}
        </div>

        <div className="flex-1">
          <div className="font-medium text-sm">{getItemName()}</div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{Math.round(item.actual_calories)} cal</span>
            <span>{item.actual_protein.toFixed(1)}g protein</span>
            {item.type === "meal" && item.meal?.is_traditional && (
              <Badge variant="secondary" className="text-xs">
                {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={consumptionAmount}
                  onChange={(e) => setConsumptionAmount(e.target.value)}
                  className="w-20 h-6 text-xs"
                  min="0"
                  step="0.1"
                />
                <span className="text-xs text-muted-foreground">
                  {item.type === "meal"
                    ? item.consumption_unit === "grams"
                      ? "g"
                      : t({ ar: "حصة", fr: "portion", en: "serving" })
                    : "g"}
                </span>
                <Button size="sm" variant="ghost" onClick={handleSaveConsumption} className="h-6 w-6 p-0">
                  <Check className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {item.consumption_amount}
                  {item.type === "meal"
                    ? item.consumption_unit === "grams"
                      ? "g"
                      : " " + t({ ar: "حصة", fr: "portion", en: "serving" })
                    : "g"}{" "}
                  ({item.consumption_percentage.toFixed(0)}%)
                </span>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-6 w-6 p-0">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove(item.id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
