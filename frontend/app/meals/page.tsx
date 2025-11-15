import { getUserMeals } from "@/lib/actions/meals"
import { MealManagement } from "@/components/meal-management"
import { redirect } from "next/navigation"

export default async function MealsPage() {
  const result = await getUserMeals()

  if (!result.success) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MealManagement meals={result.meals} />
    </div>
  )
}
