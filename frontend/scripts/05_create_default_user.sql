-- Create a default user for meal storage
-- This is a temporary solution until proper authentication is implemented

INSERT INTO user_profiles (
  id,
  email,
  full_name,
  age,
  gender,
  activity_level,
  goal_calories,
  goal_protein,
  goal_carbohydrates,
  goal_fat,
  goal_fiber,
  goal_sodium,
  preferred_language,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'default@moroccannutrition.app',
  'Default User',
  30,
  'other',
  'moderate',
  2000,
  150,
  250,
  65,
  25,
  2300,
  'fr',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
