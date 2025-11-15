"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { supabase } from "@/lib/supabase/client"
import type { Category, Ingredient } from "@/lib/types/nutrition"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IngredientSelectorProps {
  onIngredientSelect: (ingredient: Ingredient) => void
  children: React.ReactNode
}

export function IngredientSelector({ onIngredientSelect, children }: IngredientSelectorProps) {
  const { t, secondLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      const { data: categoriesData } = await supabase.from("categories").select("*").order("name_fr")

      const { data: ingredientsData } = await supabase.from("ingredients").select("*").order("name_fr")

      if (categoriesData) setCategories(categoriesData)
      if (ingredientsData) setIngredients(ingredientsData)
    }

    if (open) {
      fetchData()
    }
  }, [open])

  useEffect(() => {
    let filtered = ingredients

    if (selectedCategory !== "all") {
      filtered = filtered.filter((ingredient) => ingredient.category_id === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (ingredient) =>
          ingredient.name_fr.toLowerCase().includes(query) ||
          ingredient.name_en.toLowerCase().includes(query) ||
          ingredient.name_ar.includes(query) ||
          ingredient.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    setFilteredIngredients(filtered)
  }, [ingredients, selectedCategory, searchQuery])

  const handleIngredientSelect = (ingredient: Ingredient) => {
    onIngredientSelect(ingredient)
    setOpen(false)
    setSearchQuery("")
    setSelectedCategory("all")
  }

  const handleIngredientSelectAndKeepOpen = (ingredient: Ingredient) => {
    onIngredientSelect(ingredient)
    // Don't close modal, don't reset search/category
  }

  const getIngredientName = (ingredient: Ingredient) => {
    return t({
      ar: ingredient.name_ar,
      fr: ingredient.name_fr,
      en: ingredient.name_en,
    })
  }

  const getSecondLanguageTranslation = (ingredient: Ingredient) => {
    if (!secondLanguage) return null

    const translations = {
      ar: ingredient.name_ar,
      fr: ingredient.name_fr,
      en: ingredient.name_en,
    }

    return translations[secondLanguage]
  }

  const getCategoryName = (category: Category) => {
    return t({
      ar: category.name_ar,
      fr: category.name_fr,
      en: category.name_en,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {t({
              ar: "اختر مكون",
              fr: "Sélectionner un ingrédient",
              en: "Select Ingredient",
            })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t({
                  ar: "ابحث عن المكونات...",
                  fr: "Rechercher des ingrédients...",
                  en: "Search ingredients...",
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t({ ar: "جميع الفئات", fr: "Toutes les catégories", en: "All categories" })}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {getCategoryName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{getIngredientName(ingredient)}</h4>
                      {(() => {
                        const secondLanguageTranslation = getSecondLanguageTranslation(ingredient)
                        return secondLanguageTranslation &&
                          secondLanguageTranslation !== getIngredientName(ingredient) ? (
                          <p className="text-xs text-emerald-600 font-medium mt-1">{secondLanguageTranslation}</p>
                        ) : null
                      })()}
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>{ingredient.calories} cal</span>
                        <span>{ingredient.protein}g protein</span>
                      </div>
                      {ingredient.is_traditional && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleIngredientSelect(ingredient)}
                        className="p-1 rounded hover:bg-emerald-100 text-emerald-600 transition-colors"
                        title={t({
                          ar: "إضافة وإغلاق",
                          fr: "Ajouter et fermer",
                          en: "Add and close",
                        })}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleIngredientSelectAndKeepOpen(ingredient)}
                        className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors"
                        title={t({
                          ar: "إضافة والاستمرار",
                          fr: "Ajouter et continuer",
                          en: "Add and keep adding",
                        })}
                      >
                        <Plus className="h-4 w-4" />
                        <Plus className="h-3 w-3 -mt-1 -ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
