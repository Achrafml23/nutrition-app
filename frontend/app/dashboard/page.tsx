"use client"

import { useState } from "react"
import { LanguageProvider } from "@/lib/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentMeals } from "@/components/recent-meals"
import { QuickActions } from "@/components/quick-actions"
import { NutritionOverview } from "@/components/nutrition-overview"
import { MealExportImport } from "@/components/meal-export-import"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Meal } from "@/lib/types/nutrition"
import { LayoutDashboard, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function DashboardContent() {
  const { t } = useLanguage()

  // Mock data - in real app, this would come from Supabase
  const [dashboardData, setDashboardData] = useState({
    stats: {
      todayCalories: 1650,
      calorieGoal: 2000,
      weeklyAverage: 1850,
      mealsPlanned: 12,
      favoriteMeals: 5,
      traditionalMealsCount: 8,
    },
    todayNutrition: {
      calories: 1650,
      protein: 85.2,
      carbohydrates: 180.5,
      fat: 65.8,
      fiber: 22.3,
      sodium: 1850,
    },
    goals: {
      calories: 2000,
      protein: 100,
      carbohydrates: 250,
      fat: 67,
      fiber: 25,
      sodium: 2300,
    },
    recentMeals: [
      {
        id: "1",
        name: t({ ar: "كسكس بالخضار", fr: "Couscous aux légumes", en: "Vegetable Couscous" }),
        ingredients: [],
        total_calories: 450,
        total_protein: 15.2,
        total_carbohydrates: 78.5,
        total_fat: 8.3,
        total_fiber: 6.2,
        total_sodium: 320,
        servings: 1,
        is_favorite: false,
        is_traditional: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: "2",
        name: t({ ar: "طاجين الدجاج", fr: "Tajine de poulet", en: "Chicken Tagine" }),
        ingredients: [],
        total_calories: 380,
        total_protein: 28.5,
        total_carbohydrates: 12.3,
        total_fat: 24.1,
        total_fiber: 3.8,
        total_sodium: 450,
        servings: 1,
        is_favorite: true,
        is_traditional: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
    ] as (Meal & { created_at: string })[],
    favoriteMeals: [
      {
        id: "2",
        name: t({ ar: "طاجين الدجاج", fr: "Tajine de poulet", en: "Chicken Tagine" }),
        ingredients: [],
        total_calories: 380,
        total_protein: 28.5,
        total_carbohydrates: 12.3,
        total_fat: 24.1,
        total_fiber: 3.8,
        total_sodium: 450,
        servings: 1,
        is_favorite: true,
        is_traditional: true,
      },
      {
        id: "3",
        name: t({ ar: "حريرة مغربية", fr: "Harira marocaine", en: "Moroccan Harira" }),
        ingredients: [],
        total_calories: 220,
        total_protein: 12.8,
        total_carbohydrates: 35.2,
        total_fat: 4.5,
        total_fiber: 8.1,
        total_sodium: 680,
        servings: 1,
        is_favorite: true,
        is_traditional: true,
      },
    ] as Meal[],
  })

  const handleImportMeals = (importedMeals: Meal[]) => {
    // TODO: Save imported meals to Supabase
    console.log("Importing meals to dashboard:", importedMeals)

    // Update dashboard data with imported meals
    setDashboardData((prev) => ({
      ...prev,
      recentMeals: [
        ...importedMeals.map((meal) => ({
          ...meal,
          created_at: new Date().toISOString(),
        })),
        ...prev.recentMeals,
      ],
      favoriteMeals: [...prev.favoriteMeals, ...importedMeals.filter((meal) => meal.is_favorite)],
    }))
  }

  const allMeals = [...dashboardData.recentMeals.map(({ created_at, ...meal }) => meal), ...dashboardData.favoriteMeals]

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
                <LayoutDashboard className="h-8 w-8 text-emerald-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {t({
                      ar: "لوحة التحكم",
                      fr: "Tableau de Bord",
                      en: "Dashboard",
                    })}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {t({
                      ar: "نظرة عامة على تغذيتك وأهدافك",
                      fr: "Aperçu de votre nutrition et objectifs",
                      en: "Overview of your nutrition and goals",
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t({
                ar: "مرحباً بك في رحلتك الغذائية المغربية",
                fr: "Bienvenue dans votre parcours nutritionnel marocain",
                en: "Welcome to your Moroccan nutrition journey",
              })}
            </h2>
            <p className="text-gray-600">
              {t({
                ar: "تتبع تقدمك واكتشف الأطعمة التقليدية المغربية",
                fr: "Suivez vos progrès et découvrez les aliments traditionnels marocains",
                en: "Track your progress and discover traditional Moroccan foods",
              })}
            </p>
          </div>

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
                    ar: `${allMeals.length} وجبة في مجموعتك`,
                    fr: `${allMeals.length} repas dans votre collection`,
                    en: `${allMeals.length} meals in your collection`,
                  })}
                </div>
                <MealExportImport meals={allMeals} onImportMeals={handleImportMeals} />
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Stats */}
          <DashboardStats stats={dashboardData.stats} />

          {/* Nutrition Overview and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <NutritionOverview todayNutrition={dashboardData.todayNutrition} goals={dashboardData.goals} />
            </div>
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* Recent and Favorite Meals */}
          <RecentMeals recentMeals={dashboardData.recentMeals} favoriteMeals={dashboardData.favoriteMeals} />
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  )
}
