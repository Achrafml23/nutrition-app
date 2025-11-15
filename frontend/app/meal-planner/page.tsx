"use client"
import { LanguageProvider } from "@/lib/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import SimpleMealPlanner from "@/components/simple-meal-planner"
import { useLanguage } from "@/lib/contexts/language-context"
import { CalendarDays, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function MealPlannerContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("رجوع", "Retour", "Back")}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {t("مخطط الوجبات", "Planificateur de Repas", "Meal Planner")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "خطط وجباتك اليومية مع تتبع التغذية",
                      "Planifiez vos repas quotidiens avec suivi nutritionnel",
                      "Plan your daily meals with nutrition tracking",
                    )}
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
        <SimpleMealPlanner />
      </main>
    </div>
  )
}

export default function MealPlannerPage() {
  return (
    <LanguageProvider>
      <MealPlannerContent />
    </LanguageProvider>
  )
}
