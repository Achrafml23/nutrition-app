# Migration Guide: Next.js/Supabase → FastAPI/PostgreSQL

This guide covers the migration from a full Next.js application with Supabase to a FastAPI backend + Next.js frontend architecture with PostgreSQL.

## Overview

### What Changed

**Before:**
- Full Next.js app with Server Actions
- Supabase for database and API
- Direct database queries from frontend

**After:**
- **Backend**: FastAPI with PostgreSQL (using SQLModel and Alembic)
- **Frontend**: Next.js with React Query for API calls
- **Architecture**: Clear separation between frontend and backend

---

## Backend Setup (FastAPI)

### 1. Database Models Created

All models are in `/backend/backend/app/models/nutrition.py`:

- **Category** - Ingredient categories (Grains, Vegetables, Proteins, etc.)
- **Ingredient** - Moroccan ingredients with nutritional data
- **Meal** - User-created meal recipes
- **MealIngredient** - Junction table linking meals and ingredients
- **SavedDay** - Saved daily meal plans

### 2. API Routes Created

All routes are in `/backend/backend/app/api/routes/`:

#### Ingredients (`/ingredients/`)
- `GET /ingredients/` - List all ingredients (with filters)
- `GET /ingredients/{id}` - Get single ingredient
- `POST /ingredients/` - Create ingredient
- `PUT /ingredients/{id}` - Update ingredient
- `DELETE /ingredients/{id}` - Delete ingredient
- `GET /ingredients/categories` - List all categories

#### Meals (`/meals/`)
- `GET /meals/` - List all meals (with filters)
- `GET /meals/{id}` - Get single meal with ingredients
- `POST /meals/` - Create meal with ingredients
- `PUT /meals/{id}` - Update meal
- `DELETE /meals/{id}` - Delete meal
- `PATCH /meals/{id}/favorite` - Toggle favorite status

#### Days (`/days/`)
- `GET /days/` - List all saved day plans
- `GET /days/{id}` - Get single day plan
- `POST /days/` - Create day plan
- `PUT /days/{id}` - Update day plan
- `DELETE /days/{id}` - Delete day plan

### 3. Run Database Migration

```bash
cd backend/backend/app

# Run the migration (using alembic)
alembic upgrade head

# Or if using Docker:
docker exec -it <backend-container> alembic upgrade head
```

### 4. Seed Initial Data

Seed Moroccan ingredients and categories:

```bash
cd backend/backend/app
python -m app.models.seeds.seed_nutrition_data

# Or if using Docker:
docker exec -it <backend-container> python -m app.models.seeds.seed_nutrition_data
```

This will create:
- 8 categories (Grains, Vegetables, Fruits, Proteins, Dairy, Spices, Oils, Legumes)
- 14 traditional Moroccan ingredients (Couscous, Chicken, Dates, Olive Oil, etc.)

### 5. Start Backend Server

```bash
cd backend
# Install dependencies (if not done)
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

---

## Frontend Setup (Next.js)

### 1. New API Structure

The frontend now follows the **lifeareas pattern** with separate directories for each domain:

```
frontend/app/
├── ingredients/
│   ├── ingredients-types.ts    # TypeScript types
│   ├── ingredients-api.ts      # API client functions
│   └── useIngredients.ts       # React Query hooks
├── meals-api/
│   ├── meals-types.ts
│   ├── meals-api.ts
│   └── useMeals.ts
└── days-api/
    ├── days-types.ts
    ├── days-api.ts
    └── useDays.ts
```

### 2. Update Environment Variables

Create/update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Install Dependencies

Make sure React Query is installed:

```bash
cd frontend
npm install @tanstack/react-query
```

### 4. Setup React Query Provider

Ensure your app has the QueryClientProvider (usually in `app/layout.tsx`):

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

## Migration Steps for Components

### Step 1: Remove Supabase Dependencies

**Old code (using Supabase):**
```tsx
import { getUserMeals } from "@/lib/actions/meals"

const { meals } = await getUserMeals()
```

**New code (using React Query):**
```tsx
import { useMeals } from "@/app/meals-api/useMeals"

const { data: mealsData, isLoading } = useMeals()
const meals = mealsData?.data || []
```

### Step 2: Update Component Patterns

#### Example: Ingredient Browser Component

**Old:**
```tsx
// Server component with Supabase
const supabase = createClient()
const { data } = await supabase.from('ingredients').select('*')
```

**New:**
```tsx
'use client'
import { useIngredients } from '@/app/ingredients/useIngredients'

function IngredientBrowser() {
  const { data, isLoading, error } = useIngredients({
    search: searchTerm,
    is_traditional: true
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading ingredients</div>

  return (
    <div>
      {data?.data.map(ingredient => (
        <IngredientCard key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  )
}
```

#### Example: Meal Builder

**Old:**
```tsx
import { saveMeal } from "@/lib/actions/meals"

const handleSave = async () => {
  await saveMeal(mealData)
}
```

**New:**
```tsx
import { useCreateMeal } from '@/app/meals-api/useMeals'

const { mutate: createMeal, isPending } = useCreateMeal()

const handleSave = () => {
  createMeal(mealData, {
    onSuccess: () => {
      toast.success('Meal created!')
    }
  })
}
```

### Step 3: Update Type Imports

**Old:**
```tsx
import type { Ingredient, Meal } from "@/lib/types/nutrition"
```

**New:**
```tsx
import type { Ingredient } from "@/app/ingredients/ingredients-types"
import type { Meal } from "@/app/meals-api/meals-types"
```

---

## Component Updates Required

You'll need to update these components to use the new API:

1. **Ingredient Browser** (`components/ingredient-browser.tsx`)
   - Replace Supabase client with `useIngredients()` hook
   - Update to client component with 'use client'

2. **Meal Builder** (`app/meal-builder/page.tsx`)
   - Use `useCreateMeal()` and `useUpdateMeal()` mutations
   - Update ingredient fetching with `useIngredients()`

3. **Meals Management** (`app/meals/page.tsx`)
   - Use `useMeals()` for listing
   - Use `useDeleteMeal()` for deletion
   - Use `useToggleMealFavorite()` for favorites

4. **Meal Planner** (`app/meal-planner/page.tsx`)
   - Use `useMeals()` to load meals
   - Use `useIngredients()` for ingredient search
   - Use `useCreateSavedDay()` to save day plans

5. **Dashboard** (`app/dashboard/page.tsx`)
   - Use `useMeals()` and `useSavedDays()` for stats

---

## Testing the Migration

### 1. Test Backend API

```bash
# Test ingredients endpoint
curl http://localhost:8000/ingredients/

# Test categories
curl http://localhost:8000/ingredients/categories

# Test meals
curl http://localhost:8000/meals/
```

### 2. Test Frontend Integration

1. Start the backend: `uvicorn app.main:app --reload`
2. Start the frontend: `npm run dev`
3. Visit http://localhost:3000
4. Check browser console for API calls
5. Verify data loads correctly

---

## Common Issues & Solutions

### Issue: CORS Errors

**Solution:** Add CORS middleware to FastAPI main.py:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Migration Not Found

**Solution:** Set the correct `down_revision` in the migration file:

```python
# In nutrition_tables_2025_11_15.py
down_revision = 'ffe9c6344745'  # Set to your latest migration
```

### Issue: React Query Not Updating

**Solution:** Ensure mutations invalidate queries:

```tsx
const { mutate } = useCreateMeal()

mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['meals'] })
  }
})
```

---

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Rollback Plan

If you need to rollback:

1. **Database**: `alembic downgrade -1`
2. **Code**: Keep old Supabase code in `lib/actions/` until migration is complete
3. **Environment**: Switch `NEXT_PUBLIC_API_URL` back to Supabase URL

---

## Next Steps

1. ✅ Backend models and routes created
2. ✅ Frontend API structure created
3. ⏳ Update all components to use new API
4. ⏳ Remove Supabase dependencies
5. ⏳ Test all CRUD operations
6. ⏳ Deploy to production

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js)                │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Components (React)                 │   │
│  │  - Ingredient Browser               │   │
│  │  - Meal Builder                     │   │
│  │  - Meal Planner                     │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │  React Query Hooks                  │   │
│  │  - useIngredients()                 │   │
│  │  - useMeals()                       │   │
│  │  - useSavedDays()                   │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │  API Client (Axios)                 │   │
│  │  - /ingredients/*                   │   │
│  │  - /meals/*                         │   │
│  │  - /days/*                          │   │
│  └──────────────┬──────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────────┐
│         Backend (FastAPI)                   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  API Routes                         │   │
│  │  - /ingredients/                    │   │
│  │  - /meals/                          │   │
│  │  - /days/                           │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │  SQLModel Models                    │   │
│  │  - Category, Ingredient             │   │
│  │  - Meal, MealIngredient             │   │
│  │  - SavedDay                         │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│  ┌──────────────▼──────────────────────┐   │
│  │  PostgreSQL Database                │   │
│  │  - categories                       │   │
│  │  - ingredients                      │   │
│  │  - meals                            │   │
│  │  - meal_ingredients                 │   │
│  │  - saved_days                       │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Support

For issues or questions:
1. Check the Swagger docs at `/docs`
2. Review the migration file for schema details
3. Check backend logs for API errors
4. Check browser console for frontend errors

Happy migrating! 🚀
