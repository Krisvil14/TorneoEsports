import enum
import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
from sqlalchemy.dialects.postgresql import ENUM, UUID
from sqlalchemy.orm import relationship

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
    is_leader = db.Column(db.Boolean(), nullable=False, default=False)
    is_in_team = db.Column(db.Boolean(), nullable=False, default=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True)
    role = db.Column(db.String(20), nullable=False, default='user')

    # one to many (parent)
    applications = relationship("Application", back_populates="user")

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
            "is_leader": self.is_leader,
            "is_in_team": self.is_in_team,
            "team_id": self.team_id,
            "role": self.role,
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

    # one to many (parent)
    applications = relationship('Application', back_populates="tournament")

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
    max_players = db.Column(db.Integer, nullable=False, default=5)
    game = db.Column(game_enum, nullable=False)
    tournament_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tournament.id'), nullable=True)

    # one to many (parent)
    applications = relationship('Application', back_populates="team")

    def __repr__(self):
        return f'<Team {self.name}>'

    def __repr__(self):
        return f'<Team {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "max_players": self.max_players,
            "game": self.game.name,
            # Include the number of team members
            "member_count": User.query.filter_by(team_id=self.id).count()
        }

class ActionEnum(enum.Enum):
    join_team = 'join_team'
    join_tournament = 'join_tournament'
    do_payment = 'do_payment'

action_enum = ENUM(ActionEnum, name='actionenum', create_type=False)

class StatusEnum(enum.Enum):
    pending = 'pending'
    approved = 'approved'
    rejected = 'rejected'

status_enum = ENUM(StatusEnum, name='statusenum', create_type=False)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment = db.Column(db.String(120), nullable=True)
    action = db.Column(action_enum, nullable=False)
    status = db.Column(status_enum, nullable=False)
    active = db.Column(db.Boolean(), nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    # foreign keys
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    teamID = db.Column(db.Integer,db.ForeignKey('team.id'), nullable=True)
    tournamentID = db.Column(UUID(as_uuid=True), db.ForeignKey('tournament.id'), nullable=True)

    # relationships (child)
    user = relationship('User', back_populates="applications")
    team = relationship('Team', back_populates="applications")
    tournament = relationship('Tournament', back_populates="applications")

    def __repr__(self):
        return f'<Application {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "userID": self.userID,
            "teamID": self.teamID,
            "tournamentID": str(self.tournamentID),
            "payment": self.payment,
            "action": self.action.name,
            "status": self.status.name,
            "active": self.active,
            "created_at": self.created_at,
        }
