"""switch from one to many to manytomany, add trackables manytomany

Revision ID: b9ad2bfcfa7c
Revises: 950cecfef878
Create Date: 2025-11-07 21:45:43.807734

"""
from datetime import datetime, timezone
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'b9ad2bfcfa7c'
down_revision = '950cecfef878'
branch_labels = None
depends_on = None


def upgrade():
    # Get connection to execute raw SQL
    conn = op.get_bind()

    # Insert existing goal_id relationships into goal_habit table
    # Only insert where goal_id is not NULL
    conn.execute(sa.text("""
        INSERT INTO goal_habit (goal_id, habit_id, created_at)
        SELECT goal_id, id, :created_at
        FROM habit
        WHERE goal_id IS NOT NULL
    """), {"created_at": datetime.now(timezone.utc)})

    # Now drop the foreign key constraint and column
    op.drop_constraint('habit_goal_id_fkey', 'habit', type_='foreignkey')
    op.drop_column('habit', 'goal_id')


def downgrade():
    # Add the column back
    op.add_column('habit', sa.Column('goal_id', sa.UUID(), autoincrement=False, nullable=True))

    # Restore the foreign key
    op.create_foreign_key('habit_goal_id_fkey', 'habit', 'goal', ['goal_id'], ['id'])

    # Optionally restore the data from goal_habit table (taking the first goal if multiple exist)
    conn = op.get_bind()
    conn.execute(sa.text("""
        UPDATE habit
        SET goal_id = gh.goal_id
        FROM (
            SELECT DISTINCT ON (habit_id) habit_id, goal_id
            FROM goal_habit
            ORDER BY habit_id, created_at
        ) AS gh
        WHERE habit.id = gh.habit_id
    """))
