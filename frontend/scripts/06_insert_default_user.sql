-- Create a default user profile to satisfy foreign key constraints
INSERT INTO user_profiles (
    user_id,
    id,
    name,
    daily_calories,
    protein_percentage,
    carbs_percentage,
    fat_percentage,
    fiber_grams,
    sodium_mg,
    preferred_language,
    dietary_restrictions,
    preferred_region,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'Default User',
    2000,
    25,
    50,
    25,
    25,
    2300,
    'en',
    '{}',
    'morocco',
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO NOTHING;
