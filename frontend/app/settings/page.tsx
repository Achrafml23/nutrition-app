"use client"

import { UserSettings } from "@/components/user-settings"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة / Retour / Back
        </Button>
      </div>
      <div className="flex justify-center">
        <UserSettings />
      </div>
    </div>
  )
}
