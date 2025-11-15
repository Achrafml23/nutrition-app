"""update color classes in lifearea

Revision ID: 77e6e7a9ae20
Revises: 3d5fab11a7ee
Create Date: 2025-10-31 21:15:37.311227

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '77e6e7a9ae20'
down_revision = '3d5fab11a7ee'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        UPDATE lifearea
        SET
            color = CASE name
                WHEN 'HEALTH' THEN '#EF4444'
                WHEN 'CAREER' THEN '#3B82F6'
                WHEN 'FINANCE' THEN '#10B981'
                WHEN 'RELATIONSHIPS' THEN '#EC4899'
                WHEN 'PERSONAL_GROWTH' THEN '#F59E0B'
                WHEN 'SPIRITUALITY' THEN '#8B5CF6'
                WHEN 'RECREATION' THEN '#F97316'
                WHEN 'ENVIRONMENT' THEN '#6366F1'
                WHEN 'CONTRIBUTION' THEN '#06B6D4'
            END,
            color_class = CASE name
                WHEN 'HEALTH' THEN 'text-red-500'
                WHEN 'CAREER' THEN 'text-blue-500'
                WHEN 'FINANCE' THEN 'text-emerald-500'
                WHEN 'RELATIONSHIPS' THEN 'text-pink-500'
                WHEN 'PERSONAL_GROWTH' THEN 'text-amber-500'
                WHEN 'SPIRITUALITY' THEN 'text-violet-500'
                WHEN 'RECREATION' THEN 'text-orange-500'
                WHEN 'ENVIRONMENT' THEN 'text-indigo-500'
                WHEN 'CONTRIBUTION' THEN 'text-cyan-500'
            END
        WHERE name IN (
            'HEALTH', 'CAREER', 'FINANCE', 'RELATIONSHIPS',
            'PERSONAL_GROWTH', 'SPIRITUALITY', 'RECREATION',
            'ENVIRONMENT', 'CONTRIBUTION'
        );
    """)


def downgrade():
    # Revert the color values to the Tailwind color class strings
    op.execute("""
        UPDATE lifearea
        SET
            color = CASE name
                WHEN 'HEALTH' THEN 'text-red-500'
                WHEN 'CAREER' THEN 'text-blue-500'
                WHEN 'FINANCE' THEN 'text-emerald-500'
                WHEN 'RELATIONSHIPS' THEN 'text-pink-500'
                WHEN 'PERSONAL_GROWTH' THEN 'text-amber-500'
                WHEN 'SPIRITUALITY' THEN 'text-violet-500'
                WHEN 'RECREATION' THEN 'text-orange-500'
                WHEN 'ENVIRONMENT' THEN 'text-indigo-500'
                WHEN 'CONTRIBUTION' THEN 'text-cyan-500'
            END,
            color_class = NULL
        WHERE name IN (
            'HEALTH', 'CAREER', 'FINANCE', 'RELATIONSHIPS',
            'PERSONAL_GROWTH', 'SPIRITUALITY', 'RECREATION',
            'ENVIRONMENT', 'CONTRIBUTION'
        );
    """)
