-- Update meal categories to standard breakfast, lunch, dinner, snacks
DELETE FROM meal_categories;

INSERT INTO meal_categories (id, name_ar, name_fr, name_en, typical_time, color, sort_order) VALUES
('breakfast', 'الإفطار', 'Petit-déjeuner', 'Breakfast', '07:00-09:00', '#f59e0b', 1),
('lunch', 'الغداء', 'Déjeuner', 'Lunch', '12:00-14:00', '#10b981', 2),
('dinner', 'العشاء', 'Dîner', 'Dinner', '19:00-21:00', '#3b82f6', 3),
('snacks', 'الوجبات الخفيفة', 'Collations', 'Snacks', '10:00-22:00', '#8b5cf6', 4);
