import type { MealTypeSuggestion } from "@/lib/types/nutrition"

export const MEAL_TYPE_SUGGESTIONS: MealTypeSuggestion[] = [
  {
    name_en: "Breakfast",
    name_fr: "Petit-déjeuner",
    name_ar: "فطور",
    color: "bg-orange-500",
    typical_time: "08:00",
    icon: "☀️",
  },
  {
    name_en: "Mid-Morning Snack",
    name_fr: "Collation matinale",
    name_ar: "وجبة خفيفة صباحية",
    color: "bg-yellow-500",
    typical_time: "10:30",
    icon: "🍎",
  },
  {
    name_en: "Lunch",
    name_fr: "Déjeuner",
    name_ar: "غداء",
    color: "bg-green-500",
    typical_time: "13:00",
    icon: "🌞",
  },
  {
    name_en: "Afternoon Snack",
    name_fr: "Goûter",
    name_ar: "وجبة خفيفة بعد الظهر",
    color: "bg-blue-500",
    typical_time: "16:00",
    icon: "🥨",
  },
  {
    name_en: "Dinner",
    name_fr: "Dîner",
    name_ar: "عشاء",
    color: "bg-purple-500",
    typical_time: "19:00",
    icon: "🌙",
  },
  {
    name_en: "Evening Snack",
    name_fr: "Collation du soir",
    name_ar: "وجبة خفيفة مسائية",
    color: "bg-indigo-500",
    typical_time: "21:00",
    icon: "🌟",
  },
  {
    name_en: "Late Night",
    name_fr: "Tard dans la nuit",
    name_ar: "وقت متأخر من الليل",
    color: "bg-gray-600",
    typical_time: "23:00",
    icon: "🌚",
  },
]

export const getRandomMealColor = () => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
