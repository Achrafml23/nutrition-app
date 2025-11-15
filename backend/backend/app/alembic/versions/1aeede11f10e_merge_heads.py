"""merge heads

Revision ID: 1aeede11f10e
Revises: e802264fd31b, abc123def456
Create Date: 2025-11-14 04:02:49.018558

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '1aeede11f10e'
down_revision = ('e802264fd31b', 'abc123def456')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
