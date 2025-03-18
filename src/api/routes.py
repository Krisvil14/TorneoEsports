from flask import Flask, request, jsonify, url_for, Blueprint, render_template
from api.models import db, User, RoleEnum, Team, Tournament, GameEnum
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

    return jsonify({"user": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role.name,
            "is_active": user.is_active
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

    # Verificar el rol del usuario que realiza la solicitud solo si ya hay usuarios en la base de datos
    if role is RoleEnum.admin:
        if not admin_id:
            return jsonify({"error": "No se especificó el administrador que realiza el registro"}), 400
        admin_user = User.query.get(admin_id)
        if not admin_user or admin_user.role != RoleEnum.admin:
            return jsonify({"error": "Solo un administrador puede registrar a un administrador"}), 403

    # Crear el nuevo usuario
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        cedula=cedula,
        age=age,
        email=email,
        password=password,
        role=RoleEnum[role],
        is_active=True,
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

@api.route('/Regteams', methods=['POST'])
def register_team():
     data = request.form
    
     name = data.get('name')
     members_count = data.get('members_count')
     game = data.get('game')

     if not name or not members_count or not game:
         return jsonify({"error": "Faltan datos"}), 400

     new_team = Team(
         name=name,
         members_count=members_count,
         game=game,
     )
     db.session.add(new_team)
     db.session.commit()

     return jsonify({"message": "Equipo registrado exitosamente"}), 201

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

@api.route('/teams', methods=['GET'])
def get_teams():
    teams = Team.query.all()
    return jsonify([team.serialize() for team in teams]), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = []
    for user in users:
        teams = Team.query.filter_by().all()
        user.is_in_team = False
        for team in teams:
            if team.name == user.first_name:
                user.is_in_team = True
                break
        user_list.append(user.serialize())
    return jsonify(user_list), 200

@api.route('/tournaments/<tournament_id>/teams', methods=['POST'])
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
