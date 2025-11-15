-- Remove the foreign key constraint and make user_id nullable
ALTER TABLE meals DROP CONSTRAINT IF EXISTS meals_user_id_fkey;
ALTER TABLE meals ALTER COLUMN user_id DROP NOT NULL;
