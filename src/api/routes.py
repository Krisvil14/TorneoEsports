from flask import Flask, request, jsonify, url_for, Blueprint, render_template
from api.models import db, User, Team, Tournament, GameEnum
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import re

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

def validate_password(password):
    if (len(password) < 8 or
        not re.search(r'[A-Z]', password) or
        not re.search(r'[a-z]', password) or
        not re.search(r'[0-9]', password)):
        return False
    return True



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def login_user():
    data = request.form

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Introduzca todos los campos"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify({"error": "Credenciales inválidas"}), 401

    team = Team.query.get(user.team_id)
    team_name = team.name if team else None

    return jsonify({"user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_active": user.is_active,
            "role": user.role,
            "cedula": user.cedula,
            "is_in_team": user.is_in_team,
            "team_id": user.team_id,
            "team_name": team_name
        }}), 200

@api.route('/recovery', methods=['POST'])
def recover_user():
    data = request.form

    email = data.get('email')

    if not email:
        return jsonify({"error": "Introduzca el correo"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Correo no asociado a un usuario"}), 401

    return jsonify({"message": "En breve recibirá un email con instrucciones para recuperar su contraseña"}), 200
    # TO DO // TODO: enviar email de recuperación al usuario


@api.route('/register', methods=['GET'])
def show_register_form():
    return render_template('register.html')

@api.route('/register', methods=['POST'])
def register_user():
    data = request.form
    
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    cedula = data.get('cedula')
    age = data.get('age')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not first_name or not last_name or not cedula or not age or not email or not password or not role:
        return jsonify({"error": "Faltan datos"}), 400

    # Validar la contraseña
    if not validate_password(password):
        return jsonify({"error": "La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número y tener minimo 8 caracteres"}), 400

    # Verificar que el email sea único
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    # Verificar que la cédula sea única
    if User.query.filter_by(cedula=cedula).first():
        return jsonify({"error": "La cédula ya está registrada"}), 400

    # Crear el nuevo usuario
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        cedula=cedula,
        age=age,
        email=email,
        password=password,
        role=role,
        is_active=True,
    )
    db.session.add(new_user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

@api.route('/Regteams', methods=['POST'])
def register_team():
     data = request.form
    
     name = data.get('name')
     game = data.get('game')

     if not name or not game:
         return jsonify({"error": "Faltan datos"}), 400

     new_team = Team(
         name=name,
         game=GameEnum[game],
     )
     db.session.add(new_team)
     db.session.commit()

     return jsonify({"message": "Equipo registrado exitosamente"}), 201

@api.route('/admin/create_tournament', methods=['POST'])
def create_tournament():
    data = request.form

    name = data.get('name')
    date_start = data.get('date_start')
    num_max_teams = data.get('num_max_teams')
    game = data.get('game')

    if not name or not date_start or not num_max_teams or not game:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        num_max_teams = int(num_max_teams)
    except ValueError:
        return jsonify({"error": "Cantidad de equipos debe ser un número entero válido"}), 400

    try:
        new_tournament = Tournament(
            name=name,
            date_start=date_start,
            num_max_teams=num_max_teams,
            game=GameEnum[game],
        )
        db.session.add(new_tournament)
        db.session.commit()

        response = jsonify({"message": "Torneo creado exitosamente"})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Add CORS header
        return response, 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/admin/add_player_to_team/<int:user_id>', methods=['POST'])
def add_player_to_team(user_id):
    """
    Adds a player to a team
    """
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    team_id = request.form.get('team_id', None)

    if user.team_id is not None and not team_id:
        user.team_id = None
        user.is_in_team = False
    elif team_id:
        team = Team.query.get(team_id)
        if team is None:
            return jsonify({"error": "Team not found"}), 404

        # Check if the team is full
        team_members = User.query.filter_by(team_id=team_id).count()
        if team_members >= team.max_players:
            return jsonify({"error": "El equipo está lleno"}), 400

        user.team_id = team_id
        user.is_in_team = True  # Update is_in_team attribute
    else:
        return jsonify({"error": "Team id is required"}), 400

    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route('/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    """
    Get a team by id
    """
    team = Team.query.get(team_id)
    if team is None:
        return jsonify({"error": "Team not found"}), 404

    return jsonify(team.serialize()), 200

@api.route('/teams/<int:team_id>/users', methods=['GET'])
def get_team_users(team_id):
    """
    Get all users in a team
    """
    team = Team.query.get(team_id)
    if team is None:
        return jsonify({"error": "Team not found"}), 404

    users = User.query.filter_by(team_id=team_id)
    return jsonify([user.serialize() for user in users]), 200

@api.route('/tournaments', methods=['GET'])
def get_tournaments():
    tournaments = Tournament.query.all()
    tournament_list = []
    try:
        for tournament in tournaments:
            num_teams = len(tournament.teams)
            tournament_data = tournament.serialize()
            tournament_data['num_teams'] = num_teams
            tournament_list.append(tournament_data)
        response = jsonify(tournament_list)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/tournaments/<tournament_id>', methods=['GET'])
def get_tournament(tournament_id):
    try:
        tournament = Tournament.query.get(tournament_id)
        if not tournament:
            return jsonify({"error": "Torneo no encontrado"}), 404

        tournament_data = tournament.serialize()
        response = jsonify(tournament_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/teams/user/<int:user_id>', methods=['GET'])
def get_user_team(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    if user.team_id is None:
        return jsonify([]), 200

    team = Team.query.get(user.team_id)
    if team is None:
        return jsonify({"error": "Team not found"}), 404

    return jsonify([team.serialize()]), 200

@api.route('/teams', methods=['GET'])
def get_teams():
    teams = Team.query.all()
    print(teams)
    return jsonify([team.serialize() for team in teams]), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        team = Team.query.get(user.team_id)
        team_name = team.name if team else None
        user_list.append({
            **user.serialize(),
            "team_name": team_name
        })
    return jsonify(user_list), 200

@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        response = jsonify(user.serialize())
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/admin/tournaments/<tournament_id>/teams', methods=['POST'])
def add_team_to_tournament(tournament_id):
    data = request.form

    team_id = data.get('team_id')

    if not team_id:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        tournament = Tournament.query.get(tournament_id)
        if not tournament:
            return jsonify({"error": "Torneo no encontrado"}), 404

        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Equipo no encontrado"}), 404

        if team in tournament.teams:
            return jsonify({"error": "Elija un equipo que no este registrado en este torneo"}), 400

        tournament.teams.append(team)
        db.session.commit()

        # Recalculate num_teams for the tournament
        num_teams = len(tournament.teams)
        tournament.num_teams = num_teams
        db.session.commit()

        return jsonify({"message": "Equipo añadido al torneo exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/admin/create_user', methods=['POST'])
def create_user():
    data = request.form
    
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    cedula = data.get('cedula')
    age = data.get('age')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not first_name or not last_name or not cedula or not age or not email or not password or not role:
        return jsonify({"error": "Faltan datos"}), 400

    # Validar la contraseña
    if not validate_password(password):
        return jsonify({"error": "La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número y tener minimo 8 caracteres"}), 400

    # Verificar que el email sea único
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    # Verificar que la cédula sea única
    if User.query.filter_by(cedula=cedula).first():
        return jsonify({"error": "La cédula ya está registrada"}), 400

    # Crear el nuevo usuario
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        cedula=cedula,
        age=age,
        email=email,
        password=password,
        role=role,
        is_active=True,
    )
    db.session.add(new_user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Usuario creado exitosamente"}), 201
