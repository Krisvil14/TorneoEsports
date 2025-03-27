import enum
import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
from sqlalchemy.dialects.postgresql import ENUM, UUID

db = SQLAlchemy()



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    cedula = db.Column(db.String(20), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    is_in_team = db.Column(db.Boolean(), nullable=False, default=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True)
    
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
            "is_active": self.is_active,
            "is_in_team": self.is_in_team,
            "team_id": self.team_id,
        }

class GameEnum(enum.Enum):
    league_of_legends = 'League of Legends'
    valorant = 'Valorant'

game_enum = ENUM(GameEnum, name='gameenum', create_type=False)

class Tournament(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    name = db.Column(db.String(120), nullable=False)
    date_start = db.Column(db.String(50), nullable=False)
    num_max_teams = db.Column(db.Integer, nullable=False)
    game = db.Column(game_enum, nullable=False)
    teams = db.relationship('Team', backref='tournament', lazy=True)

    __table_args__ = (
        CheckConstraint('num_max_teams >= 5 AND num_max_teams <= 10', name='num_max_teams_check'),
    )

    def __repr__(self):
        return f'<Tournament {self.name}>'

    def serialize(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "date_start": self.date_start,
            "num_max_teams": self.num_max_teams,
            "game": self.game.name,
        }
    
class Team(db.Model):
    
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(80), nullable=False)
     members_count = db.Column(db.Integer, nullable=False)
     game = db.Column(game_enum, nullable=False)

     def __repr__(self):
         return f'<Team {self.name}>'
    
     tournament_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tournament.id'), nullable=True)

     def __repr__(self):
         return f'<Team {self.name}>'
    
     def serialize(self):
         return {
             "id": self.id,
             "name": self.name,
             "members_count": self.members_count,
             "game": self.game.name,
         }
