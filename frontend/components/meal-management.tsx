"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Meal } from "@/lib/types/nutrition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  Award,
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Calendar,
  Users,
  Flame,
  ChefHat,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { deleteMeal, toggleMealFavorite } from "@/lib/actions/meals"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface MealManagementProps {
  meals: (Meal & { created_at?: string; meal_ingredients?: any[] })[]
}

export function MealManagement({ meals: initialMeals }: MealManagementProps) {
  const { t, language, secondLanguage } = useLanguage()
  const router = useRouter()
  const [meals, setMeals] = useState(initialMeals)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set())
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; meal: Meal | null }>({
    open: false,
    meal: null,
  })

  const filteredMeals = meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const toggleMealExpansion = (mealId: string) => {
    const newExpanded = new Set(expandedMeals)
    if (newExpanded.has(mealId)) {
      newExpanded.delete(mealId)
    } else {
      newExpanded.add(mealId)
    }
    setExpandedMeals(newExpanded)
  }

  const getIngredientName = (ingredient: any) => {
    const primaryName = ingredient[`name_${language}`] || ingredient.name_en || ingredient.name
    if (!secondLanguage || secondLanguage === "none" || secondLanguage === language) {
      return primaryName
    }

    const secondaryName = ingredient[`name_${secondLanguage}`]
    if (secondaryName && secondaryName !== primaryName) {
      return (
        <div className="flex flex-col">
          <span>{primaryName}</span>
          <span className="text-xs text-emerald-600 font-medium">{secondaryName}</span>
        </div>
      )
    }
    return primaryName
  }

  const handleEdit = (meal: Meal) => {
    // Navigate to meal builder with meal data
    router.push(`/meal-builder?edit=${meal.id}`)
  }

  const handleDelete = async (meal: Meal) => {
    const result = await deleteMeal(meal.id)
    if (result.success) {
      setMeals(meals.filter((m) => m.id !== meal.id))
      toast.success(
        t({
          ar: "تم حذف الوجبة بنجاح",
          fr: "Repas supprimé avec succès",
          en: "Meal deleted successfully",
        }),
      )
    } else {
      toast.error(
        t({
          ar: "خطأ في حذف الوجبة",
          fr: "Erreur lors de la suppression",
          en: "Error deleting meal",
        }),
      )
    }
    setDeleteDialog({ open: false, meal: null })
  }

  const handleToggleFavorite = async (meal: Meal) => {
    const result = await toggleMealFavorite(meal.id, !meal.is_favorite)
    if (result.success) {
      setMeals(meals.map((m) => (m.id === meal.id ? { ...m, is_favorite: !m.is_favorite } : m)))
      toast.success(
        t({
          ar: meal.is_favorite ? "تم إزالة من المفضلة" : "تم إضافة للمفضلة",
          fr: meal.is_favorite ? "Retiré des favoris" : "Ajouté aux favoris",
          en: meal.is_favorite ? "Removed from favorites" : "Added to favorites",
        }),
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t({ ar: "إدارة الوجبات", fr: "Gestion des Repas", en: "Meal Management" })}
          </h1>
          <p className="text-muted-foreground">
            {t({
              ar: `${meals.length} وجبة محفوظة`,
              fr: `${meals.length} repas sauvegardés`,
              en: `${meals.length} saved meals`,
            })}
          </p>
        </div>
        <Button onClick={() => router.push("/meal-builder")}>
          {t({ ar: "إنشاء وجبة جديدة", fr: "Créer un Nouveau Repas", en: "Create New Meal" })}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t({
            ar: "البحث في الوجبات...",
            fr: "Rechercher des repas...",
            en: "Search meals...",
          })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <Card key={meal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {meal.name}
                    {meal.is_favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                  </CardTitle>
                  {meal.description && <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(meal)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t({ ar: "تعديل", fr: "Modifier", en: "Edit" })}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleFavorite(meal)}>
                      <Heart className="h-4 w-4 mr-2" />
                      {meal.is_favorite
                        ? t({ ar: "إزالة من المفضلة", fr: "Retirer des favoris", en: "Remove from favorites" })
                        : t({ ar: "إضافة للمفضلة", fr: "Ajouter aux favoris", en: "Add to favorites" })}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, meal })} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t({ ar: "حذف", fr: "Supprimer", en: "Delete" })}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {meal.is_traditional && (
                    <Badge variant="secondary" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {t({ ar: "تقليدي", fr: "Traditionnel", en: "Traditional" })}
                    </Badge>
                  )}
                  {meal.is_favorite && (
                    <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                      <Heart className="h-3 w-3 mr-1" />
                      {t({ ar: "مفضل", fr: "Favori", en: "Favorite" })}
                    </Badge>
                  )}
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>{Math.round(meal.total_calories)} cal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>
                      {meal.servings} {t({ ar: "حصة", fr: "portions", en: "servings" })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>P: {meal.total_protein.toFixed(1)}g</div>
                  <div>C: {meal.total_carbohydrates.toFixed(1)}g</div>
                  <div>F: {meal.total_fat.toFixed(1)}g</div>
                </div>

                {meal.meal_ingredients && meal.meal_ingredients.length > 0 && (
                  <div className="border-t pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMealExpansion(meal.id)}
                      className="w-full justify-between p-2 h-auto"
                    >
                      <div className="flex items-center gap-2">
                        <ChefHat className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium">
                          {t({ ar: "المكونات", fr: "Ingrédients", en: "Ingredients" })} ({meal.meal_ingredients.length})
                        </span>
                      </div>
                      {expandedMeals.has(meal.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>

                    {expandedMeals.has(meal.id) && (
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {meal.meal_ingredients.map((mealIngredient: any, index: number) => (
                          <div key={index} className="flex justify-between items-start text-xs bg-gray-50 rounded p-2">
                            <div className="flex-1">{getIngredientName(mealIngredient.ingredients)}</div>
                            <div className="text-right text-muted-foreground ml-2">
                              <div>
                                {mealIngredient.quantity} {mealIngredient.unit}
                              </div>
                              <div className="text-orange-600">{Math.round(mealIngredient.calories)} cal</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Date */}
                {meal.created_at && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(meal.created_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm
              ? t({
                  ar: "لم يتم العثور على وجبات تطابق البحث",
                  fr: "Aucun repas trouvé pour cette recherche",
                  en: "No meals found matching your search",
                })
              : t({
                  ar: "لا توجد وجبات محفوظة بعد",
                  fr: "Aucun repas sauvegardé encore",
                  en: "No saved meals yet",
                })}
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, meal: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t({ ar: "تأكيد الحذف", fr: "Confirmer la Suppression", en: "Confirm Deletion" })}
            </DialogTitle>
            <DialogDescription>
              {t({
                ar: `هل أنت متأكد من حذف الوجبة "${deleteDialog.meal?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
                fr: `Êtes-vous sûr de vouloir supprimer le repas "${deleteDialog.meal?.name}" ? Cette action ne peut pas être annulée.`,
                en: `Are you sure you want to delete the meal "${deleteDialog.meal?.name}"? This action cannot be undone.`,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, meal: null })}>
              {t({ ar: "إلغاء", fr: "Annuler", en: "Cancel" })}
            </Button>
            <Button variant="destructive" onClick={() => deleteDialog.meal && handleDelete(deleteDialog.meal)}>
              {t({ ar: "حذف", fr: "Supprimer", en: "Delete" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
