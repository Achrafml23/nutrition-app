"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import type { Meal } from "@/lib/types/nutrition"
import { downloadMealsAsJSON, parseMealImportFile } from "@/lib/utils/meal-export-import"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface MealExportImportProps {
  meals: Meal[]
  onImportMeals?: (meals: Meal[]) => void
}

export function MealExportImport({ meals, onImportMeals }: MealExportImportProps) {
  const { t } = useLanguage()
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    type: "idle" | "success" | "error"
    message?: string
    mealsCount?: number
  }>({ type: "idle" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    if (meals.length === 0) return

    const filename = t({
      ar: `وجبات-مغربية-${new Date().toISOString().split("T")[0]}.json`,
      fr: `repas-marocains-${new Date().toISOString().split("T")[0]}.json`,
      en: `moroccan-meals-${new Date().toISOString().split("T")[0]}.json`,
    })

    downloadMealsAsJSON(meals, filename)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportStatus({ type: "idle" })

    try {
      const result = await parseMealImportFile(file)

      if (result.isValid && result.meals) {
        setImportStatus({
          type: "success",
          message: t({
            ar: "تم تحليل الملف بنجاح",
            fr: "Fichier analysé avec succès",
            en: "File parsed successfully",
          }),
          mealsCount: result.meals.length,
        })

        onImportMeals?.(result.meals)
      } else {
        setImportStatus({
          type: "error",
          message:
            result.error ||
            t({
              ar: "فشل في تحليل الملف",
              fr: "Échec de l'analyse du fichier",
              en: "Failed to parse file",
            }),
        })
      }
    } catch (error) {
      setImportStatus({
        type: "error",
        message: t({
          ar: "حدث خطأ أثناء معالجة الملف",
          fr: "Erreur lors du traitement du fichier",
          en: "Error processing file",
        }),
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const closeImportDialog = () => {
    setIsImportDialogOpen(false)
    setImportStatus({ type: "idle" })
  }

  return (
    <div className="flex gap-3">
      {/* Export Button */}
      <Button
        onClick={handleExport}
        disabled={meals.length === 0}
        variant="outline"
        className="flex items-center gap-2 bg-transparent"
      >
        <Download className="h-4 w-4" />
        {t({ ar: "تصدير الوجبات", fr: "Exporter les repas", en: "Export meals" })}
      </Button>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            {t({ ar: "استيراد الوجبات", fr: "Importer les repas", en: "Import meals" })}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t({ ar: "استيراد الوجبات", fr: "Importer les repas", en: "Import meals" })}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t({ ar: "تنسيق الملف", fr: "Format de fichier", en: "File format" })}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {t({
                  ar: "يدعم ملفات JSON المصدرة من هذا التطبيق فقط",
                  fr: "Supporte uniquement les fichiers JSON exportés depuis cette application",
                  en: "Only supports JSON files exported from this application",
                })}
              </CardContent>
            </Card>

            {/* File Input */}
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} className="hidden" />

            <Button onClick={handleImportClick} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {t({ ar: "اختر ملف JSON", fr: "Choisir un fichier JSON", en: "Choose JSON file" })}
            </Button>

            {/* Import Status */}
            {importStatus.type !== "idle" && (
              <Alert
                className={
                  importStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }
              >
                <div className="flex items-center gap-2">
                  {importStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={importStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                    {importStatus.message}
                    {importStatus.type === "success" && importStatus.mealsCount && (
                      <div className="mt-1 text-sm">
                        {t({
                          ar: `تم استيراد ${importStatus.mealsCount} وجبة`,
                          fr: `${importStatus.mealsCount} repas importés`,
                          en: `${importStatus.mealsCount} meals imported`,
                        })}
                      </div>
                    )}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {importStatus.type === "success" && (
              <Button onClick={closeImportDialog} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {t({ ar: "تم", fr: "Terminé", en: "Done" })}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
