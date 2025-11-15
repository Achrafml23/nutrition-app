-- Seed core Moroccan ingredients with complete nutritional data
INSERT INTO ingredients (
    id, category_id, name_fr, name_en, name_ar,
    calories, protein, carbohydrates, fat, fiber, sodium,
    measurement_units, default_unit, typical_serving, unit_conversions, tags, is_traditional
) VALUES
-- Grains and Cereals
('couscous', 'grains_cereals', 'Couscous', 'Couscous', 'كسكس', 
 376, 13.0, 73.0, 0.6, 5.0, 10, 
 ARRAY['grams'], 'grams', 150, '{}', ARRAY['traditional', 'staple', 'grain'], true),

('wheat', 'grains_cereals', 'Blé', 'Wheat', 'قمح',
 340, 13.7, 71.2, 2.5, 12.2, 5,
 ARRAY['grams'], 'grams', 100, '{}', ARRAY['grain', 'whole_grain'], false),

('barley', 'grains_cereals', 'Orge', 'Barley', 'شعير',
 354, 12.5, 73.5, 2.3, 17.3, 12,
 ARRAY['grams'], 'grams', 100, '{}', ARRAY['grain', 'whole_grain', 'traditional'], true),

('rice', 'grains_cereals', 'Riz', 'Rice', 'أرز',
 365, 7.1, 80.4, 0.7, 1.3, 5,
 ARRAY['grams'], 'grams', 150, '{}', ARRAY['grain', 'staple'], false),

('semolina', 'grains_cereals', 'Semoule', 'Semolina', 'سميد',
 360, 12.7, 72.8, 1.1, 3.9, 1,
 ARRAY['grams'], 'grams', 100, '{}', ARRAY['grain', 'traditional', 'flour'], true),

('wheat_flour', 'grains_cereals', 'Farine de blé', 'Wheat flour', 'دقيق القمح',
 364, 10.3, 76.3, 1.0, 2.7, 2,
 ARRAY['grams'], 'grams', 100, '{}', ARRAY['flour', 'baking'], false),

-- Legumes and Pulses
('lentils', 'legumes_pulses', 'Lentilles', 'Lentils', 'عدس',
 353, 24.6, 63.4, 1.1, 10.7, 6,
 ARRAY['grams'], 'grams', 200, '{}', ARRAY['legume', 'protein', 'traditional'], true),

('chickpeas', 'legumes_pulses', 'Pois chiches', 'Chickpeas', 'حمص',
 364, 19.3, 61.0, 6.0, 12.5, 24,
 ARRAY['grams'], 'grams', 200, '{}', ARRAY['legume', 'protein', 'traditional', 'staple'], true),

('white_beans', 'legumes_pulses', 'Haricots blancs', 'White beans', 'لوبيا بيضاء',
 333, 23.4, 60.3, 0.9, 15.2, 16,
 ARRAY['grams'], 'grams', 200, '{}', ARRAY['legume', 'protein'], false),

('red_beans', 'legumes_pulses', 'Haricots rouges', 'Red beans', 'لوبيا حمراء',
 333, 22.5, 60.0, 1.1, 12.2, 2,
 ARRAY['grams'], 'grams', 200, '{}', ARRAY['legume', 'protein'], false),

('fava_beans', 'legumes_pulses', 'Fèves', 'Fava beans', 'فول',
 341, 26.1, 58.3, 1.5, 25.0, 13,
 ARRAY['grams'], 'grams', 200, '{}', ARRAY['legume', 'protein', 'traditional'], true),

('split_peas', 'legumes_pulses', 'Pois cassés', 'Split peas', 'بازلاء مقشرة',
 341, 24.6, 60.4, 1.2, 8.3, 4,
 ARRAY['grams'], 'grams', 200, '{}', ARRAY['legume', 'protein'], false),

-- Meat and Poultry
('lamb', 'meat_poultry', 'Agneau', 'Lamb', 'لحم خروف',
 294, 24.5, 0.0, 21.0, 0.0, 72,
 ARRAY['grams'], 'grams', 150, '{}', ARRAY['meat', 'protein', 'traditional', 'halal'], true),

('beef', 'meat_poultry', 'Bœuf', 'Beef', 'لحم بقر',
 250, 26.1, 0.0, 15.0, 0.0, 72,
 ARRAY['grams'], 'grams', 150, '{}', ARRAY['meat', 'protein', 'halal'], false),

('chicken', 'meat_poultry', 'Poulet', 'Chicken', 'دجاج',
 239, 27.3, 0.0, 13.6, 0.0, 82,
 ARRAY['grams'], 'grams', 150, '{}', ARRAY['poultry', 'protein', 'halal'], false),

('goat', 'meat_poultry', 'Chèvre', 'Goat', 'لحم ماعز',
 143, 27.1, 0.0, 3.0, 0.0, 86,
 ARRAY['grams'], 'grams', 150, '{}', ARRAY['meat', 'protein', 'traditional', 'halal', 'lean'], true),

('merguez', 'meat_poultry', 'Merguez', 'Merguez sausage', 'مرقاز',
 297, 15.0, 2.0, 25.0, 0.0, 1200,
 ARRAY['grams', 'pieces'], 'grams', 100, '{"pieces": 50}', ARRAY['sausage', 'protein', 'traditional', 'halal', 'spiced'], true),

('kefta', 'meat_poultry', 'Kefta', 'Meatballs', 'كفتة',
 250, 20.0, 5.0, 16.0, 0.5, 350,
 ARRAY['grams', 'pieces'], 'grams', 120, '{"pieces": 30}', ARRAY['meat', 'protein', 'traditional', 'halal', 'prepared'], true);
