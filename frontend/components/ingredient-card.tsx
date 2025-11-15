"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import type { Ingredient } from "@/lib/types/nutrition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Award, Zap } from "lucide-react"

interface IngredientCardProps {
  ingredient: Ingredient
  onClick?: () => void
}

export function IngredientCard({ ingredient, onClick }: IngredientCardProps) {
  const { t, secondLanguage } = useLanguage()

  const ingredientName = t({
    ar: ingredient.name_ar,
    fr: ingredient.name_fr,
    en: ingredient.name_en,
  })

  const getSecondLanguageTranslation = () => {
    if (!secondLanguage) return null

    const translations = {
      ar: ingredient.name_ar,
      fr: ingredient.name_fr,
      en: ingredient.name_en,
    }

    return translations[secondLanguage]
  }

  const secondLanguageTranslation = getSecondLanguageTranslation()

  return (
    <Card
      className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/30 hover:from-emerald-50/50 hover:to-emerald-100/40"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-slate-800 leading-tight mb-1">{ingredientName}</CardTitle>
            {secondLanguageTranslation && secondLanguageTranslation !== ingredientName && (
              <p className="text-sm text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-md inline-block">
                {secondLanguageTranslation}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {ingredient.is_traditional && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs border-amber-200">
                <Award className="h-3 w-3 mr-1" />
                {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
              </Badge>
            )}
            {ingredient.is_halal && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs border-green-200">
                <Leaf className="h-3 w-3 mr-1" />
                {t({ ar: "حلال", fr: "Halal", en: "Halal" })}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white/60 rounded-lg p-3 mb-3 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">
              {t({ ar: "القيم الغذائية", fr: "Valeurs nutritionnelles", en: "Nutrition Facts" })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{t({ ar: "سعرات", fr: "Calories", en: "Calories" })}</span>
                <span className="font-bold text-slate-800 bg-emerald-100 px-2 py-1 rounded text-xs">
                  {ingredient.calories}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{t({ ar: "بروتين", fr: "Protéines", en: "Protein" })}</span>
                <span className="font-semibold text-slate-700">{ingredient.protein}g</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{t({ ar: "كربوهيدرات", fr: "Glucides", en: "Carbs" })}</span>
                <span className="font-semibold text-slate-700">{ingredient.carbohydrates}g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{t({ ar: "دهون", fr: "Lipides", en: "Fat" })}</span>
                <span className="font-semibold text-slate-700">{ingredient.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {ingredient.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ingredient.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              >
                {tag}
              </Badge>
            ))}
            {ingredient.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                +{ingredient.tags.length - 3} {t({ ar: "المزيد", fr: "plus", en: "more" })}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
