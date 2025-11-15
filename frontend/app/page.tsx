"use client"

import { LanguageProvider } from "@/lib/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { IngredientBrowser } from "@/components/ingredient-browser"
import { DebugPanel } from "@/components/debug-panel"
import { useLanguage } from "@/lib/contexts/language-context"
import { Utensils, Leaf, ChefHat, Calculator, CalendarDays, LayoutDashboard, Settings, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function AppContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Utensils className="h-8 w-8 text-emerald-600" />
                <Leaf className="h-6 w-6 text-teal-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t({
                    ar: "حاسبة التغذية المغربية",
                    fr: "Calculateur Nutrition Marocaine",
                    en: "Moroccan Nutrition Calculator",
                  })}
                </h1>
                <p className="text-sm text-gray-600">
                  {t({
                    ar: "رفيقك الشخصي للمأكولات المغربية",
                    fr: "Votre compagnon personnel de cuisine marocaine",
                    en: "Your Personal Moroccan Cuisine Companion",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t({ ar: "لوحة التحكم", fr: "Tableau de Bord", en: "Dashboard" })}
                </Button>
              </Link>
              <Link href="/meals">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t({ ar: "إدارة الوجبات", fr: "Mes Repas", en: "My Meals" })}
                </Button>
              </Link>
              <Link href="/nutrition-calculator">
                <Button variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  {t({ ar: "حاسبة التغذية", fr: "Calculateur", en: "Calculator" })}
                </Button>
              </Link>
              <Link href="/meal-planner">
                <Button variant="outline">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {t({ ar: "مخطط الوجبات", fr: "Planificateur", en: "Meal Planner" })}
                </Button>
              </Link>
              <Link href="/meal-builder">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <ChefHat className="h-4 w-4 mr-2" />
                  {t({ ar: "منشئ الوجبات", fr: "Créateur de Repas", en: "Meal Builder" })}
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DebugPanel />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t({
              ar: "استكشف المكونات المغربية",
              fr: "Explorez les Ingrédients Marocains",
              en: "Explore Moroccan Ingredients",
            })}
          </h2>
          <p className="text-gray-600">
            {t({
              ar: "اكتشف القيم الغذائية للمكونات التقليدية المغربية",
              fr: "Découvrez les valeurs nutritionnelles des ingrédients traditionnels marocains",
              en: "Discover the nutritional values of traditional Moroccan ingredients",
            })}
          </p>
        </div>

        <IngredientBrowser />
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
