"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat, Calculator, CalendarDays, Search, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const { t } = useLanguage()

  const actions = [
    {
      title: t({ ar: "إنشاء وجبة", fr: "Créer un Repas", en: "Create Meal" }),
      description: t({
        ar: "أنشئ وجبة جديدة مع حساب التغذية",
        fr: "Créez un nouveau repas avec calcul nutritionnel",
        en: "Create a new meal with nutrition calculation",
      }),
      icon: ChefHat,
      href: "/meal-builder",
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: t({ ar: "حاسبة التغذية", fr: "Calculateur Nutrition", en: "Nutrition Calculator" }),
      description: t({
        ar: "احسب وقارن القيم الغذائية",
        fr: "Calculez et comparez les valeurs nutritionnelles",
        en: "Calculate and compare nutritional values",
      }),
      icon: Calculator,
      href: "/nutrition-calculator",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: t({ ar: "خطط الوجبات", fr: "Planifier Repas", en: "Plan Meals" }),
      description: t({
        ar: "خطط وجباتك اليومية والأسبوعية",
        fr: "Planifiez vos repas quotidiens et hebdomadaires",
        en: "Plan your daily and weekly meals",
      }),
      icon: CalendarDays,
      href: "/meal-planner",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: t({ ar: "استكشف المكونات", fr: "Explorer Ingrédients", en: "Explore Ingredients" }),
      description: t({
        ar: "تصفح قاعدة بيانات المكونات المغربية",
        fr: "Parcourez la base de données d'ingrédients marocains",
        en: "Browse Moroccan ingredients database",
      }),
      icon: Search,
      href: "/",
      color: "bg-teal-600 hover:bg-teal-700",
    },
    {
      title: t({ ar: "تتبع التقدم", fr: "Suivre Progrès", en: "Track Progress" }),
      description: t({
        ar: "راجع تاريخ التغذية والتقدم",
        fr: "Consultez l'historique nutritionnel et les progrès",
        en: "Review nutrition history and progress",
      }),
      icon: TrendingUp,
      href: "/dashboard",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: t({ ar: "الإعدادات", fr: "Paramètres", en: "Settings" }),
      description: t({
        ar: "إدارة الملف الشخصي والأهداف",
        fr: "Gérer le profil et les objectifs",
        en: "Manage profile and goals",
      }),
      icon: Settings,
      href: "/settings",
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t({
            ar: "الإجراءات السريعة",
            fr: "Actions Rapides",
            en: "Quick Actions",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow bg-transparent"
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <p className="text-xs text-muted-foreground text-left">{action.description}</p>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
