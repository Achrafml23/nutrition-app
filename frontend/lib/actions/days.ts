"use server"

import { createClient } from "@/lib/supabase/server"
import type { Day, DayPlan } from "@/lib/types/nutrition"

export async function saveDayPlan(title: string, description: string, dayPlan: DayPlan) {
  try {
    const supabase = createClient()

    const dayData: Omit<Day, "id" | "created_at" | "updated_at"> = {
      title,
      description,
      day_plan: dayPlan,
    }

    const { data, error } = await supabase.from("saved_days").insert([dayData]).select().single()

    if (error) {
      console.error("Error saving day plan:", error)
      return { success: false, error: error.message }
    }

    return { success: true, day: data }
  } catch (error) {
    console.error("Error saving day plan:", error)
    return { success: false, error: "Failed to save day plan" }
  }
}

export async function getSavedDays() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("saved_days").select("*").order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching saved days:", error)
      return { success: false, error: error.message, days: [] }
    }

    return { success: true, days: data || [] }
  } catch (error) {
    console.error("Error fetching saved days:", error)
    return { success: false, error: "Failed to fetch saved days", days: [] }
  }
}

export async function deleteSavedDay(dayId: string) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("saved_days").delete().eq("id", dayId)

    if (error) {
      console.error("Error deleting saved day:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting saved day:", error)
    return { success: false, error: "Failed to delete saved day" }
  }
}
