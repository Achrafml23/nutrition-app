"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { MealIngredient } from "@/lib/types/nutrition"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit3, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MealIngredientItemProps {
  mealIngredient: MealIngredient
  onUpdate: (id: string, quantity: number, unit: string) => void
  onRemove: (id: string) => void
}

export function MealIngredientItem({ mealIngredient, onUpdate, onRemove }: MealIngredientItemProps) {
  const { t, secondLanguage } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [editQuantity, setEditQuantity] = useState(mealIngredient.quantity.toString())
  const [editUnit, setEditUnit] = useState(mealIngredient.unit)

  const ingredientName = t({
    ar: mealIngredient.ingredient.name_ar,
    fr: mealIngredient.ingredient.name_fr,
    en: mealIngredient.ingredient.name_en,
  })

  const getSecondLanguageTranslation = () => {
    if (!secondLanguage) return null

    const translations = {
      ar: mealIngredient.ingredient.name_ar,
      fr: mealIngredient.ingredient.name_fr,
      en: mealIngredient.ingredient.name_en,
    }

    return translations[secondLanguage]
  }

  const handleSave = () => {
    const quantity = Number.parseFloat(editQuantity)
    if (quantity > 0) {
      onUpdate(mealIngredient.id, quantity, editUnit)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditQuantity(mealIngredient.quantity.toString())
    setEditUnit(mealIngredient.unit)
    setIsEditing(false)
  }

  const getUnitName = (unit: string) => {
    const unitNames = {
      grams: t({ ar: "جرام", fr: "grammes", en: "grams" }),
      pieces: t({ ar: "قطع", fr: "pièces", en: "pieces" }),
      cups: t({ ar: "أكواب", fr: "tasses", en: "cups" }),
      tablespoons: t({ ar: "ملاعق كبيرة", fr: "c. à soupe", en: "tbsp" }),
      teaspoons: t({ ar: "ملاعق صغيرة", fr: "c. à café", en: "tsp" }),
    }
    return unitNames[unit as keyof typeof unitNames] || unit
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{ingredientName}</h4>
            {(() => {
              const secondLanguageTranslation = getSecondLanguageTranslation()
              return secondLanguageTranslation && secondLanguageTranslation !== ingredientName ? (
                <p className="text-sm text-emerald-600 font-medium">{secondLanguageTranslation}</p>
              ) : null
            })()}

            {isEditing ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="w-20 h-8"
                  min="0"
                  step="0.1"
                />
                <Select value={editUnit} onValueChange={setEditUnit}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealIngredient.ingredient.measurement_units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {getUnitName(unit)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">
                  {mealIngredient.quantity} {getUnitName(mealIngredient.unit)}
                </span>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {mealIngredient.calories} {t({ ar: "سعرة", fr: "cal", en: "cal" })}
            </div>
            <div className="flex gap-2 text-xs text-gray-500 mt-1">
              <span>P: {mealIngredient.protein}g</span>
              <span>C: {mealIngredient.carbohydrates}g</span>
              <span>F: {mealIngredient.fat}g</span>
            </div>
          </div>
        </div>

        {mealIngredient.ingredient.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {mealIngredient.ingredient.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove(mealIngredient.id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
