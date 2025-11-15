"""add nutrition tables

Revision ID: nutrition_2025_11_15
Revises: (use latest revision from your migrations)
Create Date: 2025-11-15

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

# revision identifiers, used by Alembic.
revision = 'nutrition_2025_11_15'
down_revision = None  # Set this to your latest migration
branch_labels = None
depends_on = None


def upgrade():
    # Create categories table
    op.create_table(
        'categories',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('name_fr', sa.String(255), nullable=False),
        sa.Column('name_en', sa.String(255), nullable=False),
        sa.Column('name_ar', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # Create ingredients table
    op.create_table(
        'ingredients',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('category_id', UUID(as_uuid=True), sa.ForeignKey('categories.id'), nullable=False),
        sa.Column('name_fr', sa.String(255), nullable=False),
        sa.Column('name_en', sa.String(255), nullable=False),
        sa.Column('name_ar', sa.String(255), nullable=False),
        sa.Column('calories_per_100g', sa.Float, nullable=False),
        sa.Column('protein_per_100g', sa.Float, nullable=False),
        sa.Column('carbohydrates_per_100g', sa.Float, nullable=False),
        sa.Column('fat_per_100g', sa.Float, nullable=False),
        sa.Column('fiber_per_100g', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('sodium_per_100g', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('measurement_units', JSONB, nullable=False, server_default='[]'),
        sa.Column('unit_conversions', JSONB, nullable=False, server_default='{}'),
        sa.Column('tags', JSONB, nullable=False, server_default='[]'),
        sa.Column('default_unit', sa.String(50), nullable=False, server_default='g'),
        sa.Column('typical_serving', sa.Float, nullable=False, server_default='100.0'),
        sa.Column('is_traditional', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('is_halal', sa.Boolean, nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # Create meals table
    op.create_table(
        'meals',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('user.id'), nullable=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.String(1000), nullable=True),
        sa.Column('servings', sa.Float, nullable=False, server_default='1.0'),
        sa.Column('total_calories', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('total_protein', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('total_carbohydrates', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('total_fat', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('total_fiber', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('total_sodium', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('is_favorite', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('is_traditional', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # Create meal_ingredients junction table
    op.create_table(
        'meal_ingredients',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('meal_id', UUID(as_uuid=True), sa.ForeignKey('meals.id', ondelete='CASCADE'), nullable=False),
        sa.Column('ingredient_id', UUID(as_uuid=True), sa.ForeignKey('ingredients.id'), nullable=False),
        sa.Column('quantity', sa.Float, nullable=False),
        sa.Column('unit', sa.String(50), nullable=False),
        sa.Column('calories', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('protein', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('carbohydrates', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('fat', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('fiber', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('sodium', sa.Float, nullable=False, server_default='0.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )

    # Create saved_days table
    op.create_table(
        'saved_days',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('user.id'), nullable=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.String(1000), nullable=True),
        sa.Column('day_plan', JSONB, nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    # Create indexes for better query performance
    op.create_index('ix_ingredients_category_id', 'ingredients', ['category_id'])
    op.create_index('ix_ingredients_is_traditional', 'ingredients', ['is_traditional'])
    op.create_index('ix_ingredients_is_halal', 'ingredients', ['is_halal'])
    op.create_index('ix_meals_user_id', 'meals', ['user_id'])
    op.create_index('ix_meals_is_favorite', 'meals', ['is_favorite'])
    op.create_index('ix_meal_ingredients_meal_id', 'meal_ingredients', ['meal_id'])
    op.create_index('ix_meal_ingredients_ingredient_id', 'meal_ingredients', ['ingredient_id'])
    op.create_index('ix_saved_days_user_id', 'saved_days', ['user_id'])


def downgrade():
    # Drop tables in reverse order
    op.drop_table('saved_days')
    op.drop_table('meal_ingredients')
    op.drop_table('meals')
    op.drop_table('ingredients')
    op.drop_table('categories')
