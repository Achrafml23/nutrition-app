"use client"
import { LanguageProvider } from "@/lib/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { IngredientNutritionCalculator } from "@/components/ingredient-nutrition-calculator"
import { NutritionComparison } from "@/components/nutrition-comparison"
import { useLanguage } from "@/lib/contexts/language-context"
import { Calculator, Scale, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

function NutritionCalculatorContent() {
  const { t } = useLanguage()

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
                <Calculator className="h-8 w-8 text-emerald-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {t({
                      ar: "حاسبة التغذية",
                      fr: "Calculateur Nutritionnel",
                      en: "Nutrition Calculator",
                    })}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {t({
                      ar: "احسب وقارن القيم الغذائية للمكونات",
                      fr: "Calculez et comparez les valeurs nutritionnelles des ingrédients",
                      en: "Calculate and compare nutritional values of ingredients",
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              {t({ ar: "حاسبة", fr: "Calculateur", en: "Calculator" })}
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              {t({ ar: "مقارنة", fr: "Comparaison", en: "Comparison" })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <IngredientNutritionCalculator />
          </TabsContent>

          <TabsContent value="comparison">
            <NutritionComparison />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function NutritionCalculatorPage() {
  return (
    <LanguageProvider>
      <NutritionCalculatorContent />
    </LanguageProvider>
  )
}
