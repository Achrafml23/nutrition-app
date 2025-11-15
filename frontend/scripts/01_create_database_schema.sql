-- Moroccan Nutrition Calculator Database Schema
-- Supporting trilingual (Arabic, French, English) nutrition tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table for ingredient organization
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name_fr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients table with complete nutritional data
CREATE TABLE ingredients (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
    name_fr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    
    -- Nutrition per 100g
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(8,2) NOT NULL,
    carbohydrates DECIMAL(8,2) NOT NULL,
    fat DECIMAL(8,2) NOT NULL,
    fiber DECIMAL(8,2) DEFAULT 0,
    sodium DECIMAL(8,2) DEFAULT 0,
    
    -- Measurement and serving info
    measurement_units TEXT[] DEFAULT ARRAY['grams'],
    default_unit TEXT DEFAULT 'grams',
    typical_serving INTEGER DEFAULT 100,
    unit_conversions JSONB DEFAULT '{}',
    
    -- Additional metadata
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_traditional BOOLEAN DEFAULT FALSE,
    is_halal BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal categories (ftour, ghada, asha, gouter)
CREATE TABLE meal_categories (
    id TEXT PRIMARY KEY,
    name_fr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    icon TEXT,
    typical_time TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles with nutrition goals
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Personal info
    name TEXT,
    preferred_language TEXT DEFAULT 'fr' CHECK (preferred_language IN ('ar', 'fr', 'en')),
    
    -- Nutrition goals
    daily_calories INTEGER DEFAULT 2000,
    protein_percentage INTEGER DEFAULT 20,
    carbs_percentage INTEGER DEFAULT 50,
    fat_percentage INTEGER DEFAULT 30,
    fiber_grams INTEGER DEFAULT 25,
    sodium_mg INTEGER DEFAULT 2300,
    
    -- Preferences
    dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    preferred_region TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Custom meals created by users
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Calculated nutrition totals
    total_calories DECIMAL(8,2) DEFAULT 0,
    total_protein DECIMAL(8,2) DEFAULT 0,
    total_carbohydrates DECIMAL(8,2) DEFAULT 0,
    total_fat DECIMAL(8,2) DEFAULT 0,
    total_fiber DECIMAL(8,2) DEFAULT 0,
    total_sodium DECIMAL(8,2) DEFAULT 0,
    
    -- Metadata
    is_favorite BOOLEAN DEFAULT FALSE,
    is_traditional BOOLEAN DEFAULT FALSE,
    servings INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal ingredients (junction table with quantities)
CREATE TABLE meal_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,
    
    quantity DECIMAL(8,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'grams',
    
    -- Calculated nutrition for this ingredient in this meal
    calories DECIMAL(8,2) DEFAULT 0,
    protein DECIMAL(8,2) DEFAULT 0,
    carbohydrates DECIMAL(8,2) DEFAULT 0,
    fat DECIMAL(8,2) DEFAULT 0,
    fiber DECIMAL(8,2) DEFAULT 0,
    sodium DECIMAL(8,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily meal plans
CREATE TABLE daily_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    plan_date DATE NOT NULL,
    
    -- Daily totals
    total_calories DECIMAL(8,2) DEFAULT 0,
    total_protein DECIMAL(8,2) DEFAULT 0,
    total_carbohydrates DECIMAL(8,2) DEFAULT 0,
    total_fat DECIMAL(8,2) DEFAULT 0,
    total_fiber DECIMAL(8,2) DEFAULT 0,
    total_sodium DECIMAL(8,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, plan_date)
);

-- Daily plan meals (ftour, ghada, asha, gouter)
CREATE TABLE daily_plan_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_plan_id UUID REFERENCES daily_plans(id) ON DELETE CASCADE,
    meal_category_id TEXT REFERENCES meal_categories(id),
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    
    -- Portion adjustment
    portion_multiplier DECIMAL(4,2) DEFAULT 1.0,
    
    -- Calculated nutrition for this meal in this plan
    calories DECIMAL(8,2) DEFAULT 0,
    protein DECIMAL(8,2) DEFAULT 0,
    carbohydrates DECIMAL(8,2) DEFAULT 0,
    fat DECIMAL(8,2) DEFAULT 0,
    fiber DECIMAL(8,2) DEFAULT 0,
    sodium DECIMAL(8,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nutrition history for tracking over time
CREATE TABLE nutrition_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    
    -- Daily totals
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(8,2) NOT NULL,
    carbohydrates DECIMAL(8,2) NOT NULL,
    fat DECIMAL(8,2) NOT NULL,
    fiber DECIMAL(8,2) DEFAULT 0,
    sodium DECIMAL(8,2) DEFAULT 0,
    
    -- Goal achievement percentages
    calories_goal_percentage DECIMAL(5,2),
    protein_goal_percentage DECIMAL(5,2),
    carbs_goal_percentage DECIMAL(5,2),
    fat_goal_percentage DECIMAL(5,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_ingredients_category ON ingredients(category_id);
CREATE INDEX idx_ingredients_name_search ON ingredients USING gin((name_fr || ' ' || name_en || ' ' || name_ar) gin_trgm_ops);
CREATE INDEX idx_ingredients_tags ON ingredients USING gin(tags);
CREATE INDEX idx_meals_user ON meals(user_id);
CREATE INDEX idx_meal_ingredients_meal ON meal_ingredients(meal_id);
CREATE INDEX idx_daily_plans_user_date ON daily_plans(user_id, plan_date);
CREATE INDEX idx_nutrition_history_user_date ON nutrition_history(user_id, date);

-- Enable trigram extension for better text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_plans_updated_at BEFORE UPDATE ON daily_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
