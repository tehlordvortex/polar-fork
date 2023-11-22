"""Update Transaction model

Revision ID: a8159424b837
Revises: 9d1ca9706c3c
Create Date: 2023-11-22 13:37:05.970805

"""
import sqlalchemy as sa
from alembic import op

# Polar Custom Imports
from polar.kit.extensions.sqlalchemy import PostgresUUID

# revision identifiers, used by Alembic.
revision = "a8159424b837"
down_revision = "9d1ca9706c3c"
branch_labels: tuple[str] | None = None
depends_on: tuple[str] | None = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "transactions",
        sa.Column("account_currency", sa.String(length=3), nullable=False),
    )
    op.add_column(
        "transactions", sa.Column("account_amount", sa.Integer(), nullable=False)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("transactions", "account_amount")
    op.drop_column("transactions", "account_currency")
    # ### end Alembic commands ###
