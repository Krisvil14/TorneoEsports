"""empty message

Revision ID: 2b0b7db754aa
Revises: 11b431b757d1
Create Date: 2025-02-10 21:14:39.710111

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b0b7db754aa'
down_revision = '11b431b757d1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_name', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('last_name', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('cedula', sa.String(length=20), nullable=False))
        batch_op.add_column(sa.Column('age', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('role', sa.String(length=20), nullable=False))
        batch_op.create_unique_constraint(None, ['cedula'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('role')
        batch_op.drop_column('age')
        batch_op.drop_column('cedula')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')

    # ### end Alembic commands ###
