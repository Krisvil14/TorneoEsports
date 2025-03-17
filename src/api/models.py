import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ENUM

db = SQLAlchemy()

class RoleEnum(enum.Enum):
    admin = 'admin'
    player = 'player'

role_enum = ENUM(RoleEnum, name='roleenum', create_type=False)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    cedula = db.Column(db.String(20), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    role = db.Column(role_enum, nullable=False)  # Solo se puede escoger entre 'admin' o 'player'
    is_active = db.Column(db.Boolean(), nullable=False, default=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "cedula": self.cedula,
            "age": self.age,
            "email": self.email,
            "role": self.role.name,
        }
    
class Team(db.Model):
    
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(80), nullable=False)
     members_count = db.Column(db.Integer, nullable=False)
     game = db.Column(db.String(80), nullable=False)
     tournament = db.Column(db.String(80), nullable=False)

     def __repr__(self):
         return f'<Team {self.name}>'
    
     def serialize(self):
         return {
             "id": self.id,
             "name": self.name,
             "members_count": self.members_count,
             "game": self.game,
             "tournament": self.tournament,
         }