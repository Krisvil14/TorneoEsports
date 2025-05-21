import enum
import uuid
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
from sqlalchemy.dialects.postgresql import ENUM, UUID
from sqlalchemy.orm import relationship

db = SQLAlchemy()

# Enums
class RoleEnum(enum.Enum):
    user = 'user'
    admin = 'admin'

role_enum = ENUM(RoleEnum, name='roleenum', create_type=True)

class GameEnum(enum.Enum):
    league_of_legends = 'League of Legends'
    valorant = 'Valorant'

game_enum = ENUM(GameEnum, name='gameenum', create_type=False)

class ActionEnum(enum.Enum):
    join_team = 'join_team'
    join_tournament = 'join_tournament'
    do_payment = 'do_payment'
    receive_payment = 'receive_payment'

action_enum = ENUM(ActionEnum, name='actionenum', create_type=True)

class StatusEnum(enum.Enum):
    pending = 'pending'
    approved = 'approved'
    rejected = 'rejected'

status_enum = ENUM(StatusEnum, name='statusenum', create_type=False)

class PaymentTypeEnum(enum.Enum):
    incoming = 'incoming'
    outgoing = 'outgoing'

payment_type_enum = ENUM(PaymentTypeEnum, name='paymenttypeenum', create_type=False)

class BankEnum(enum.Enum):
    banco_de_venezuela = 'Banco de Venezuela'
    mercantil = 'Mercantil'
    banesco = 'Banesco'
    provincial = 'Provincial'
    bnc = 'BNC'
    banco_plaza = 'Banco Plaza'
    banco_exterior = 'Banco Exterior'
    bancaribe = 'Bancaribe'

bank_enum = ENUM(BankEnum, name='bankenum', create_type=False)

# Models
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
    role = db.Column(role_enum, nullable=False, default=RoleEnum.user)

    # Relationships
    team = relationship("Team", back_populates="members")
    applications = relationship("Application", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    stats = relationship("User_Stats", back_populates="user", uselist=False)

    __table_args__ = (
        CheckConstraint('age > 0', name='check_age_positive'),
        CheckConstraint("cedula ~ '^[0-9]+$'", name='check_cedula_numeric'),
    )

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
            "role": self.role.name if self.role else None,
        }


class Tournament(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    name = db.Column(db.String(120), nullable=False)
    date_start = db.Column(db.String(50), nullable=False)
    num_max_teams = db.Column(db.Integer, nullable=False)
    game = db.Column(game_enum, nullable=False)
    cost = db.Column(db.Integer, nullable=False, default=10) 

    # Relationships
    teams = relationship("Team", back_populates="tournament")
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
            "cost": self.cost
        }

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), nullable=True, default=True)
    max_players = db.Column(db.Integer, nullable=False, default=5)
    game = db.Column(game_enum, nullable=False)
    tournament_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tournament.id'), nullable=True)
    balance = db.Column(db.Integer, nullable=False, default=0)

    # Relationships
    tournament = relationship("Tournament", back_populates="teams")
    members = relationship("User", back_populates="team")
    applications = relationship('Application', back_populates="team")
    user_stats = relationship("User_Stats", back_populates="team")

    def __repr__(self):
        return f'<Team {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_active": self.is_active,
            "max_players": self.max_players,
            "current_players": len(self.members),
            "game": self.game.name,
            "tournament_id": str(self.tournament_id) if self.tournament_id else None,
            "members": [member.email for member in self.members],
            "balance": self.balance if self.balance is not None else 0
        }

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payment = db.Column(db.String(120), nullable=True)
    action = db.Column(action_enum, nullable=False)
    status = db.Column(status_enum, nullable=False)
    active = db.Column(db.Boolean(), nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    
    # Foreign keys
    userID = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    teamID = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True)
    tournamentID = db.Column(UUID(as_uuid=True), db.ForeignKey('tournament.id'), nullable=True)

    # Relationships
    user = relationship('User', back_populates="applications")
    team = relationship('Team', back_populates="applications")
    tournament = relationship('Tournament', back_populates="applications")
    payments = relationship("Payment", back_populates="application")

    def __repr__(self):
        return f'<Application {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "userID": self.userID,
            "teamID": self.teamID,
            "tournamentID": str(self.tournamentID) if self.tournamentID else None,
            "payment": self.payment,
            "action": self.action.name,
            "status": self.status.name,
            "active": self.active,
            "created_at": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "is_active": self.user.is_active
            } if self.user else None
        }

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    application_id = db.Column(db.Integer, db.ForeignKey('application.id'), nullable=False)
    type = db.Column(payment_type_enum, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    bank = db.Column(bank_enum, nullable=False)
    date = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    reference = db.Column(db.String(50), nullable=False)
    cedula = db.Column(db.String(20), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)

    # Relationships
    user = relationship('User', back_populates="payments")
    application = relationship('Application', back_populates="payments")

    __table_args__ = (
        CheckConstraint('amount > 0', name='check_amount_positive'),
        CheckConstraint("cedula ~ '^[0-9]+$'", name='check_payment_cedula_numeric'),
        CheckConstraint("phone_number ~ '^[0-9]+$'", name='check_phone_numeric'),
        CheckConstraint("reference ~ '^[0-9]+$'", name='check_reference_numeric'),
    )

    def __repr__(self):
        return f'<Payment {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "application_id": self.application_id,
            "type": self.type.name,
            "amount": self.amount,
            "bank": self.bank.name,
            "date": self.date.isoformat(),
            "reference": self.reference,
            "cedula": self.cedula,
            "phone_number": self.phone_number
        }

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tournament_id = db.Column(UUID(as_uuid=True), db.ForeignKey('tournament.id'), nullable=False)
    team1_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    team2_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    score1 = db.Column(db.Integer, nullable=True)
    score2 = db.Column(db.Integer, nullable=True)
    date = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    # Relationships
    tournament = relationship("Tournament")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])

    __table_args__ = (
        CheckConstraint('score1 >= 0', name='check_score1_positive'),
        CheckConstraint('score2 >= 0', name='check_score2_positive'),
    )

    def __repr__(self):
        return f'<Match {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "tournament_id": str(self.tournament_id),
            "team1_id": self.team1_id,
            "team2_id": self.team2_id,
            "score1": self.score1,
            "score2": self.score2,
            "date": self.date.isoformat(),
            "team1": self.team1.serialize() if self.team1 else None,
            "team2": self.team2.serialize() if self.team2 else None
        }

class User_Stats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True)
    kills = db.Column(db.Integer, nullable=False, default=0)
    assists = db.Column(db.Integer, nullable=False, default=0)
    deaths = db.Column(db.Integer, nullable=False, default=0)
    kda = db.Column(db.Float, nullable=False, default=0.0)

    # Relationships
    user = relationship("User", back_populates="stats")
    team = relationship("Team", back_populates="user_stats")

    __table_args__ = (
        CheckConstraint('kills >= 0', name='check_kills_positive'),
        CheckConstraint('assists >= 0', name='check_assists_positive'),
        CheckConstraint('deaths >= 0', name='check_deaths_positive'),
    )

    def __repr__(self):
        return f'<User_Stats {self.id}>'

    def calculate_kda(self):
        if self.kills == 0 and self.assists == 0:
            return 0.0
        effective_deaths = max(1, self.deaths)  # Si deaths es 0, usamos 1 para el cálculo
        return (self.kills + self.assists) / effective_deaths

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "team_id": self.team_id,
            "kills": self.kills,
            "assists": self.assists,
            "deaths": self.deaths,
            "kda": self.calculate_kda(),
            "user": self.user.serialize() if self.user else None,
            "team": self.team.serialize() if self.team else None
        }

class Team_Stats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    games_win = db.Column(db.Integer, nullable=False, default=0)
    games_lose = db.Column(db.Integer, nullable=False, default=0)
    games_count = db.Column(db.Integer, nullable=False, default=0)
    tournament_win = db.Column(db.Integer, nullable=False, default=0)
    tournament_loses = db.Column(db.Integer, nullable=False, default=0)
    tournament_count = db.Column(db.Integer, nullable=False, default=0)
    total_kills = db.Column(db.Integer, nullable=False, default=0)
    total_assists = db.Column(db.Integer, nullable=False, default=0)
    total_deaths = db.Column(db.Integer, nullable=False, default=0)
    team_kda = db.Column(db.Float, nullable=False, default=0.0)

    # Relationships
    team = relationship("Team", backref="team_stats")

    __table_args__ = (
        CheckConstraint('games_win >= 0', name='check_games_win_positive'),
        CheckConstraint('games_lose >= 0', name='check_games_lose_positive'),
        CheckConstraint('games_count >= 0', name='check_games_count_positive'),
        CheckConstraint('tournament_win >= 0', name='check_tournament_win_positive'),
        CheckConstraint('tournament_loses >= 0', name='check_tournament_loses_positive'),
        CheckConstraint('tournament_count >= 0', name='check_tournament_count_positive'),
        CheckConstraint('total_kills >= 0', name='check_total_kills_positive'),
        CheckConstraint('total_assists >= 0', name='check_total_assists_positive'),
        CheckConstraint('total_deaths >= 0', name='check_total_deaths_positive'),
    )

    def calculate_team_kda(self):
        if self.total_kills == 0 and self.total_assists == 0:
            return 0.0
        effective_deaths = max(1, self.total_deaths)
        return (self.total_kills + self.total_assists) / effective_deaths

    def __repr__(self):
        return f'<Team_Stats {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "games_win": self.games_win,
            "games_lose": self.games_lose,
            "games_count": self.games_count,
            "tournament_win": self.tournament_win,
            "tournament_loses": self.tournament_loses,
            "tournament_count": self.tournament_count,
            "total_kills": self.total_kills,
            "total_assists": self.total_assists,
            "total_deaths": self.total_deaths,
            "team_kda": self.calculate_team_kda(),
            "team": self.team.serialize() if self.team else None
        }

