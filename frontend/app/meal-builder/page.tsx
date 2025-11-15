"use client"

import { LanguageProvider } from "@/lib/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { MealBuilder } from "@/components/meal-builder"
import { MealExportImport } from "@/components/meal-export-import"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Meal } from "@/lib/types/nutrition"
import { ChefHat, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useState, useEffect } from "react"
import { saveMeal, updateMeal, getMealById } from "@/lib/actions/meals"
import { useSearchParams } from "next/navigation"

function MealBuilderContent() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const editMealId = searchParams.get("edit")

  const [savedMeals, setSavedMeals] = useState<Meal[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>(undefined)

  useEffect(() => {
    if (editMealId) {
      setIsLoading(true)
      getMealById(editMealId).then((result) => {
        if (result.success && result.meal) {
          setEditingMeal(result.meal)
        } else {
          toast({
            title: t({
              ar: "خطأ في تحميل الوجبة",
              fr: "Erreur lors du chargement",
              en: "Error loading meal",
            }),
            description: result.error,
            variant: "destructive",
          })
        }
        setIsLoading(false)
      })
    }
  }, [editMealId, t, toast])

  const handleSaveMeal = async (meal: Meal) => {
    setIsSaving(true)

    try {
      const result = editMealId && meal.id ? await updateMeal(meal) : await saveMeal(meal)

      if (result.success) {
        if (editMealId && meal.id) {
          // Update existing meal in state
          setSavedMeals((prev) => prev.map((m) => (m.id === meal.id ? { ...meal, ...result.meal } : m)))
          toast({
            title: t({
              ar: "تم تحديث الوجبة بنجاح",
              fr: "Repas mis à jour avec succès",
              en: "Meal updated successfully",
            }),
            description: t({
              ar: `تم تحديث "${meal.name}" في قاعدة البيانات`,
              fr: `"${meal.name}" a été mis à jour dans la base de données`,
              en: `"${meal.name}" has been updated in the database`,
            }),
          })
        } else {
          // Add new meal to state
          setSavedMeals((prev) => [...prev, { ...meal, id: result.meal.id }])
          toast({
            title: t({
              ar: "تم حفظ الوجبة بنجاح",
              fr: "Repas sauvegardé avec succès",
              en: "Meal saved successfully",
            }),
            description: t({
              ar: `تم حفظ "${meal.name}" في قاعدة البيانات`,
              fr: `"${meal.name}" a été sauvegardé dans la base de données`,
              en: `"${meal.name}" has been saved to the database`,
            }),
          })
        }
      } else {
        toast({
          title: t({
            ar: editMealId ? "خطأ في تحديث الوجبة" : "خطأ في حفظ الوجبة",
            fr: editMealId ? "Erreur lors de la mise à jour" : "Erreur lors de la sauvegarde",
            en: editMealId ? "Error updating meal" : "Error saving meal",
          }),
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t({
          ar: "خطأ غير متوقع",
          fr: "Erreur inattendue",
          en: "Unexpected error",
        }),
        description: t({
          ar: "حدث خطأ أثناء معالجة الوجبة",
          fr: "Une erreur s'est produite lors du traitement",
          en: "An error occurred while processing the meal",
        }),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImportMeals = (importedMeals: Meal[]) => {
    console.log("Importing meals:", importedMeals)
    setSavedMeals((prev) => [...prev, ...importedMeals])
    toast({
      title: t({
        ar: "تم استيراد الوجبات",
        fr: "Repas importés",
        en: "Meals imported",
      }),
      description: t({
        ar: `${importedMeals.length} وجبة محفوظة`,
        fr: `${importedMeals.length} repas sauvegardés`,
        en: `${importedMeals.length} saved meals`,
      }),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t({ ar: "رجوع", fr: "Retour", en: "Back" })}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <ChefHat className="h-8 w-8 text-emerald-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {editMealId
                      ? t({
                          ar: "تعديل الوجبة",
                          fr: "Modifier le Repas",
                          en: "Edit Meal",
                        })
                      : t({
                          ar: "منشئ الوجبات",
                          fr: "Créateur de Repas",
                          en: "Meal Builder",
                        })}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {editMealId
                      ? t({
                          ar: "عدّل وجبتك وحدّث المكونات",
                          fr: "Modifiez votre repas et mettez à jour les ingrédients",
                          en: "Edit your meal and update ingredients",
                        })
                      : t({
                          ar: "أنشئ وجبات مخصصة مع حساب التغذية",
                          fr: "Créez des repas personnalisés avec calcul nutritionnel",
                          en: "Create custom meals with nutrition calculation",
                        })}
                  </p>
                </div>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {savedMeals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t({
                    ar: "إدارة الوجبات",
                    fr: "Gestion des Repas",
                    en: "Meal Management",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {t({
                      ar: `${savedMeals.length} وجبة محفوظة`,
                      fr: `${savedMeals.length} repas sauvegardés`,
                      en: `${savedMeals.length} saved meals`,
                    })}
                  </div>
                  <MealExportImport meals={savedMeals} onImportMeals={handleImportMeals} />
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                <span className="text-sm font-medium">
                  {t({
                    ar: "جاري تحميل الوجبة...",
                    fr: "Chargement du repas...",
                    en: "Loading meal...",
                  })}
                </span>
              </div>
            </div>
          ) : (
            <MealBuilder initialMeal={editingMeal} onSave={handleSaveMeal} />
          )}

          {isSaving && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <span className="text-sm font-medium">
                    {t({
                      ar: "جاري حفظ الوجبة...",
                      fr: "Sauvegarde en cours...",
                      en: "Saving meal...",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function MealBuilderPage() {
  return (
    <LanguageProvider>
      <MealBuilderContent />
    </LanguageProvider>
  )
}
