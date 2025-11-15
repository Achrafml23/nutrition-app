"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "fr" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  secondLanguage: Language | null
  setSecondLanguage: (lang: Language | null) => void
  t: (translations: { ar: string; fr: string; en: string }) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")
  const [secondLanguage, setSecondLanguageState] = useState<Language | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("primary-language") as Language
    const savedSecondLanguage = localStorage.getItem("second-language")

    if (savedLanguage && ["ar", "fr", "en"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }

    if (savedSecondLanguage && savedSecondLanguage !== "null") {
      setSecondLanguageState(savedSecondLanguage as Language)
    }

    setIsLoaded(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("primary-language", lang)
    // Reset second language if it's the same as primary
    if (secondLanguage === lang) {
      setSecondLanguage(null)
    }
  }

  const setSecondLanguage = (lang: Language | null) => {
    setSecondLanguageState(lang)
    localStorage.setItem("second-language", lang || "null")
  }

  const t = (translations: { ar: string; fr: string; en: string }) => {
    return translations[language] || translations.fr
  }

  if (!isLoaded) {
    return null
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        secondLanguage,
        setSecondLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
