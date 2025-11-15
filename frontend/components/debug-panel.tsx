"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DebugPanel() {
  const { language, secondLanguage } = useLanguage()
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchIngredients = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("ingredients").select("*").limit(5)

    if (data) {
      setIngredients(data)
    }
    if (error) {
      console.error("Error fetching ingredients:", error)
    }
    setLoading(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p>
            <strong>Primary Language:</strong> {language}
          </p>
          <p>
            <strong>Second Language:</strong> {secondLanguage || "None"}
          </p>
        </div>

        <Button onClick={fetchIngredients} disabled={loading}>
          {loading ? "Loading..." : "Check Database Ingredients"}
        </Button>

        {ingredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Sample Ingredients:</h4>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                <p>
                  <strong>ID:</strong> {ingredient.id}
                </p>
                <p>
                  <strong>French:</strong> {ingredient.name_fr}
                </p>
                <p>
                  <strong>English:</strong> {ingredient.name_en}
                </p>
                <p>
                  <strong>Arabic:</strong> {ingredient.name_ar}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
