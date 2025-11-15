"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Ingredient } from "@/lib/types/nutrition"
import { IngredientSelector } from "./ingredient-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface IngredientSelectorWithQuantityProps {
  onSelect: (ingredient: Ingredient, quantity: number, unit: string) => void
}

export function IngredientSelectorWithQuantity({ onSelect }: IngredientSelectorWithQuantityProps) {
  const { t } = useLanguage()
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [quantity, setQuantity] = useState<number>(100)
  const [unit, setUnit] = useState<string>("g")
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setShowQuantityDialog(true)
  }

  const handleConfirmSelection = () => {
    if (selectedIngredient) {
      onSelect(selectedIngredient, quantity, unit)
      setShowQuantityDialog(false)
      setSelectedIngredient(null)
      setQuantity(100)
      setUnit("g")
    }
  }

  const handleCancel = () => {
    setShowQuantityDialog(false)
    setSelectedIngredient(null)
    setQuantity(100)
    setUnit("g")
  }

  if (showQuantityDialog && selectedIngredient) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-medium">
            {t({
              ar: selectedIngredient.name_ar,
              fr: selectedIngredient.name_fr,
              en: selectedIngredient.name_en,
            })}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t({
              ar: "حدد الكمية",
              fr: "Spécifiez la quantité",
              en: "Specify quantity",
            })}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="quantity">{t({ ar: "الكمية", fr: "Quantité", en: "Quantity" })}</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="unit">{t({ ar: "الوحدة", fr: "Unité", en: "Unit" })}</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">{t({ ar: "جرام", fr: "Grammes", en: "Grams" })} (g)</SelectItem>
                <SelectItem value="cup">{t({ ar: "كوب", fr: "Tasse", en: "Cup" })}</SelectItem>
                <SelectItem value="piece">{t({ ar: "قطعة", fr: "Pièce", en: "Piece" })}</SelectItem>
                <SelectItem value="tbsp">
                  {t({ ar: "ملعقة كبيرة", fr: "Cuillère à soupe", en: "Tablespoon" })}
                </SelectItem>
                <SelectItem value="tsp">{t({ ar: "ملعقة صغيرة", fr: "Cuillère à café", en: "Teaspoon" })}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
            {t({ ar: "إلغاء", fr: "Annuler", en: "Cancel" })}
          </Button>
          <Button onClick={handleConfirmSelection} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            {t({ ar: "إضافة", fr: "Ajouter", en: "Add" })}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <IngredientSelector onIngredientSelect={handleIngredientSelect}>
      <div className="h-full">
        {t({
          ar: "اختر مكون",
          fr: "Sélectionner un ingrédient",
          en: "Select ingredient",
        })}
      </div>
    </IngredientSelector>
  )
}
