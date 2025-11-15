"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { supabase } from "@/lib/supabase/client"
import type { Category, Ingredient } from "@/lib/types/nutrition"
import { IngredientCard } from "./ingredient-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function IngredientBrowser() {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Fetch categories and ingredients
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch categories
      const { data: categoriesData } = await supabase.from("categories").select("*").order("name_fr")

      // Fetch ingredients
      const { data: ingredientsData } = await supabase.from("ingredients").select("*").order("name_fr")

      if (categoriesData) setCategories(categoriesData)
      if (ingredientsData) setIngredients(ingredientsData)

      setLoading(false)
    }

    fetchData()
  }, [])

  // Filter ingredients based on search and category
  useEffect(() => {
    let filtered = ingredients

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((ingredient) => ingredient.category_id === selectedCategory)
    }

    // Filter by search query (search in all languages)
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

  const getCategoryName = (category: Category) => {
    return t({
      ar: category.name_ar,
      fr: category.name_fr,
      en: category.name_en,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-lg">{t({ ar: "جاري التحميل...", fr: "Chargement...", en: "Loading..." })}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">
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
            className="pl-10 text-base"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
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

          <Badge variant="secondary" className="text-sm">
            {filteredIngredients.length} {t({ ar: "مكون", fr: "ingrédients", en: "ingredients" })}
          </Badge>
        </div>
      </div>

      {/* Results Section */}
      {filteredIngredients.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            {searchQuery || selectedCategory !== "all"
              ? t({ ar: "لم يتم العثور على مكونات", fr: "Aucun ingrédient trouvé", en: "No ingredients found" })
              : t({ ar: "لا توجد مكونات", fr: "Aucun ingrédient disponible", en: "No ingredients available" })}
          </div>
          {(searchQuery || selectedCategory !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              className="mt-4"
            >
              {t({ ar: "مسح الفلاتر", fr: "Effacer les filtres", en: "Clear filters" })}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onClick={() => {
                // TODO: Open ingredient detail modal
                console.log("Selected ingredient:", ingredient)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
