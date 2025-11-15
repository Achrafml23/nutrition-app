"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"

export function UserSettings() {
  const { language, setLanguage, secondLanguage, setSecondLanguage, t } = useLanguage()

  const languageOptions = [
    { value: "ar", label: { ar: "العربية", fr: "Arabe", en: "Arabic" } },
    { value: "fr", label: { ar: "الفرنسية", fr: "Français", en: "French" } },
    { value: "en", label: { ar: "الإنجليزية", fr: "Anglais", en: "English" } },
  ]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t({ ar: "الإعدادات", fr: "Paramètres", en: "Settings" })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="primary-language">
            {t({ ar: "اللغة الأساسية", fr: "Langue principale", en: "Primary Language" })}
          </Label>
          <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
            <SelectTrigger id="primary-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="second-language">
            {t({
              ar: "اللغة الثانوية (للترجمة)",
              fr: "Langue secondaire (pour traduction)",
              en: "Second Language (for translation)",
            })}
          </Label>
          <Select
            value={secondLanguage || "none"}
            onValueChange={(value) => setSecondLanguage(value === "none" ? null : (value as any))}
          >
            <SelectTrigger id="second-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t({ ar: "بلا", fr: "Aucune", en: "None" })}</SelectItem>
              {languageOptions
                .filter((option) => option.value !== language)
                .map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {t({
            ar: "ستظهر الترجمة بجانب أسماء المكونات",
            fr: "Les traductions apparaîtront à côté des noms d'ingrédients",
            en: "Translations will appear next to ingredient names",
          })}
        </div>
      </CardContent>
    </Card>
  )
}
