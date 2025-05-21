from flask import Flask, request, jsonify, url_for, Blueprint, render_template
from api.models import db, User, Team, Tournament, GameEnum, Application, ActionEnum, RoleEnum, StatusEnum, Payment, PaymentTypeEnum, BankEnum, User_Stats, Team_Stats
from api.utils import generate_sitemap, APIException, approved_join_team, approved_join_tournament, approved_do_payment
from flask_cors import CORS
import re

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})

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
            "role": user.role.name if user.role else None,
            "cedula": user.cedula,
            "team_id": user.team_id,
            "is_in_team": user.is_in_team,
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
    role = data.get('role', 'user')  # Default to 'user' if not specified

    if not first_name or not last_name or not cedula or not age or not email or not password:
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

    try:
        role_enum = RoleEnum[role]
    except KeyError:
        return jsonify({"error": "Rol inválido"}), 400

    # Crear el nuevo usuario
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        cedula=cedula,
        age=age,
        email=email,
        password=password,
        role=role_enum,
        is_active=True,
    )
    db.session.add(new_user)
    try:
        db.session.commit()
        
        # Crear estadísticas iniciales para el usuario
        user_stats = User_Stats(
            user_id=new_user.id,
            team_id=None,  # Inicialmente no tiene equipo
            kills=0,
            assists=0
        )
        db.session.add(user_stats)
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

     try:
         new_team = Team(
             name=name,
             game=GameEnum[game],
             is_active=True,
         )
         db.session.add(new_team)
         db.session.commit()

         # Crear estadísticas iniciales para el equipo
         team_stats = Team_Stats(
             team_id=new_team.id,
             games_win=0,
             games_lose=0,
             games_count=0,
             tournament_win=0,
             tournament_loses=0,
             tournament_count=0
         )
         db.session.add(team_stats)
         db.session.commit()

         return jsonify({"message": "Equipo registrado exitosamente", "team_id": new_team.id}), 201
     except Exception as e:
         db.session.rollback()
         return jsonify({"error": str(e)}), 400

@api.route('/admin/Regteams', methods=['POST'])
def register_team_admin():
     data = request.form
    
     name = data.get('name')
     game = data.get('game')

     if not name or not game:
         return jsonify({"error": "Faltan datos"}), 400

     try:
         new_team = Team(
             name=name,
             game=GameEnum[game],
             is_active=True,
         )
         db.session.add(new_team)
         db.session.commit()

         # Crear estadísticas iniciales para el equipo
         team_stats = Team_Stats(
             team_id=new_team.id,
             games_win=0,
             games_lose=0,
             games_count=0,
             tournament_win=0,
             tournament_loses=0,
             tournament_count=0
         )
         db.session.add(team_stats)
         db.session.commit()

         return jsonify({"message": "Equipo registrado exitosamente", "team_id": new_team.id}), 201
     except Exception as e:
         db.session.rollback()
         return jsonify({"error": str(e)}), 400

@api.route('/admin/create_tournament', methods=['POST'])
def create_tournament():
    data = request.form

    name = data.get('name')
    date_start = data.get('date_start')
    num_max_teams = data.get('num_max_teams')
    game = data.get('game')
    cost = data.get('cost', 10)  # Por defecto el costo es 10

    if not name or not date_start or not num_max_teams or not game:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        num_max_teams = int(num_max_teams)
        cost = int(cost)
    except ValueError:
        return jsonify({"error": "Cantidad de equipos y costo deben ser números enteros válidos"}), 400

    try:
        new_tournament = Tournament(
            name=name,
            date_start=date_start,
            num_max_teams=num_max_teams,
            game=GameEnum[game],
            cost=cost
        )
        db.session.add(new_tournament)
        db.session.commit()

        response = jsonify({"message": "Torneo creado exitosamente"})
        response.headers.add('Access-Control-Allow-Origin', '*')
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
            tournament_data['num_max_teams'] = tournament.num_max_teams
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
        tournament_data['num_teams'] = len(tournament.teams)
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
    filtered_teams = [team for team in teams if len(team.members) < 5]
    return jsonify([team.serialize() for team in filtered_teams]), 200

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

@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Faltan datos"}), 400

    first_name = data.get('first_name', user.first_name)
    last_name = data.get('last_name', user.last_name)
    cedula = data.get('cedula', user.cedula)
    age = data.get('age', user.age)
    email = data.get('email', user.email)
    password = data.get('password', user.password)
    is_leader = data.get('is_leader', user.is_leader)

    if not first_name or not last_name or not cedula or not age or not email or not password:
        return jsonify({"error": "Faltan datos"}), 400

    # Validar la contraseña
    if password and not validate_password(password):
        return jsonify({"error": "La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número y tener minimo 8 caracteres"}), 400

    # Verificar que el email sea único
    if email != user.email and User.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    # Verificar que la cédula sea única
    if cedula != user.cedula and User.query.filter_by(cedula=cedula).first():
        return jsonify({"error": "La cédula ya está registrada"}), 400

    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.age = age
    user.password = password
    user.is_leader = is_leader

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Usuario actualizado exitosamente"}), 200


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

    try:
        role_enum = RoleEnum[role]
    except KeyError:
        return jsonify({"error": "Rol inválido"}), 400

    # Crear el nuevo usuario
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        cedula=cedula,
        age=age,
        email=email,
        password=password,
        role=role_enum,
        is_active=True,
    )
    db.session.add(new_user)
    try:
        db.session.commit()
        
        # Crear estadísticas iniciales para el usuario
        user_stats = User_Stats(
            user_id=new_user.id,
            team_id=None,  # Inicialmente no tiene equipo
            kills=0,
            assists=0
        )
        db.session.add(user_stats)
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Usuario creado exitosamente"}), 201

@api.route('/add_player_to_team', methods=['POST'])
def add_player_to_team_route():
    data = request.get_json()
    user_id = data.get('user_id')
    team_id = data.get('team_id')

    if not user_id or not team_id:
        return jsonify({"error": "Faltan datos"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    team = Team.query.get(team_id)
    if not team:
        return jsonify({"error": "Equipo no encontrado"}), 404

    try:
        # Actualizar el usuario
        user.team_id = team_id
        user.is_in_team = True

        # Actualizar las estadísticas del usuario
        user_stats = User_Stats.query.filter_by(user_id=user_id).first()
        if user_stats:
            user_stats.team_id = team_id
        else:
            # Si por alguna razón no existen las estadísticas, las creamos
            user_stats = User_Stats(
                user_id=user_id,
                team_id=team_id,
                kills=0,
                assists=0
            )
            db.session.add(user_stats)

        db.session.commit()
        return jsonify({"message": "Usuario añadido al equipo exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@api.route('/handle_application', methods=['POST'])
def handle_application():
    try:
        data = request.get_json()
        application_id = data.get('application_id')
        accepted = data.get('accepted')

        application = Application.query.filter_by(id=application_id).first()
        if not application:
            return jsonify({"error": "Application not found"}), 404

        if not accepted:
            application.status = 'rejected'
            application.active = False
            db.session.commit()
            return jsonify({"message": "La aplicación ha sido rechazada exitosamente"}), 200

        try:
            if accepted and application.action == ActionEnum.join_team:
                approved_join_team(application)
            if accepted and application.action == ActionEnum.join_tournament:
                approved_join_tournament(application)
            if accepted and (application.action == ActionEnum.do_payment or application.action == ActionEnum.receive_payment):
                approved_do_payment(application)

            db.session.commit()
            return jsonify({"message": "La aplicación ha sido procesada exitosamente"}), 200
        except APIException as e:
            return jsonify({"error": str(e)}), e.status_code
        except Exception as e:
            return jsonify({"error": "Error al procesar la solicitud"}), 400

    except Exception as e:
        return jsonify({"error": "Error al procesar la solicitud"}), 400

@api.route('/applications/team/<int:team_id>', methods=['GET'])
def get_team_applications(team_id):
    try:
        applications = Application.query.filter_by(teamID=team_id).all()
        return jsonify([app.serialize() for app in applications]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/team-requests/check/<int:team_id>', methods=['GET'])
def check_team_request(team_id):
    try:
        user_id = request.headers.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Verificar si ya existe una solicitud activa y pendiente para este usuario y equipo
        existing_request = Application.query.filter_by(
            userID=int(user_id),
            teamID=team_id,
            action=ActionEnum.join_team,
            active=True,
            status=StatusEnum.pending
        ).first()

        has_requested = existing_request is not None
        return jsonify({"hasRequested": has_requested}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/team-requests', methods=['POST'])
def create_team_request():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        team_id = data.get('team_id')

        if not user_id or not team_id:
            return jsonify({"error": "User ID and Team ID are required"}), 400

        # Verificar si ya existe una solicitud activa y pendiente
        existing_request = Application.query.filter_by(
            userID=user_id,
            teamID=team_id,
            action=ActionEnum.join_team,
            active=True,
            status=StatusEnum.pending
        ).first()

        if existing_request:
            return jsonify({"error": "Ya tienes una solicitud pendiente para este equipo"}), 400

        # Crear nueva solicitud
        new_request = Application(
            userID=user_id,
            teamID=team_id,
            action=ActionEnum.join_team,
            status=StatusEnum.pending,
            active=True
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({"message": "Solicitud creada exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/teams/<int:team_id>/remove_player', methods=['POST'])
def remove_player_from_team(team_id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        requesting_user_id = data.get('requesting_user_id')

        if not user_id or not requesting_user_id:
            return jsonify({"error": "Se requiere el ID del usuario y del solicitante"}), 400

        # Obtener el equipo y el usuario
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Equipo no encontrado"}), 404

        user_to_remove = User.query.get(user_id)
        if not user_to_remove:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Verificar que el usuario esté en el equipo
        if user_to_remove.team_id != team_id:
            return jsonify({"error": "El usuario no pertenece a este equipo"}), 400

        # Verificar que el usuario que hace la petición sea el líder del equipo
        requesting_user = User.query.get(requesting_user_id)
        if not requesting_user or not requesting_user.is_leader or requesting_user.team_id != team_id:
            return jsonify({"error": "No tienes permiso para eliminar jugadores de este equipo"}), 403

        # No permitir que el líder se elimine a sí mismo
        if user_to_remove.id == requesting_user.id:
            return jsonify({"error": "No puedes eliminarte a ti mismo del equipo"}), 400

        # Eliminar al usuario del equipo
        user_to_remove.team_id = None
        user_to_remove.is_in_team = False

        db.session.commit()

        return jsonify({"message": "Jugador eliminado del equipo exitosamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@api.route('/tournament-requests', methods=['POST'])
def create_tournament_request():
    try:
        data = request.get_json()
        team_id = data.get('team_id')
        tournament_id = data.get('tournament_id')

        if not team_id or not tournament_id:
            return jsonify({"error": "Team ID and Tournament ID are required"}), 400

        # Verificar si el equipo existe
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Equipo no encontrado"}), 404

        # Verificar si el torneo existe
        tournament = Tournament.query.get(tournament_id)
        if not tournament:
            return jsonify({"error": "Torneo no encontrado"}), 404

        # Verificar si el equipo ya está en un torneo
        if team.tournament_id:
            return jsonify({"error": "El equipo ya está participando en un torneo"}), 400

        # Verificar si el juego del equipo coincide con el del torneo
        if team.game != tournament.game:
            return jsonify({"error": "El juego del equipo no coincide con el del torneo"}), 400

        # Verificar si ya existe una solicitud activa y pendiente
        existing_request = Application.query.filter_by(
            teamID=team_id,
            tournamentID=tournament_id,
            action=ActionEnum.join_tournament,
            active=True,
            status=StatusEnum.pending
        ).first()

        if existing_request:
            return jsonify({"error": "Ya tienes una solicitud pendiente para este torneo"}), 400

        # Crear nueva solicitud
        new_request = Application(
            teamID=team_id,
            tournamentID=tournament_id,
            action=ActionEnum.join_tournament,
            status=StatusEnum.pending,
            active=True
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({"message": "Solicitud creada exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/tournaments/<tournament_id>/teams', methods=['GET'])
def get_tournament_teams(tournament_id):
    try:
        tournament = Tournament.query.get(tournament_id)
        if not tournament:
            return jsonify({"error": "Torneo no encontrado"}), 404

        teams = [team.serialize() for team in tournament.teams]
        return jsonify(teams), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/tournaments/<tournament_id>/applications', methods=['GET'])
def get_tournament_applications(tournament_id):
    try:
        tournament = Tournament.query.get(tournament_id)
        if not tournament:
            return jsonify({"error": "Torneo no encontrado"}), 404

        # Obtener todas las solicitudes pendientes para este torneo
        applications = Application.query.filter_by(
            tournamentID=tournament_id,
            action=ActionEnum.join_tournament,
            status=StatusEnum.pending,
            active=True
        ).all()

        # Serializar las solicitudes incluyendo información del equipo
        applications_data = []
        for app in applications:
            team = Team.query.get(app.teamID)
            if team:
                app_data = app.serialize()
                app_data['team_name'] = team.name
                applications_data.append(app_data)

        return jsonify(applications_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/team/balance', methods=['GET'])
def get_team_balance():
    try:
        user_id = request.headers.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        user = User.query.get(int(user_id))
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if not user.team_id:
            return jsonify({"error": "El usuario no pertenece a ningún equipo"}), 400

        team = Team.query.get(user.team_id)
        if not team:
            return jsonify({"error": "Equipo no encontrado"}), 404

        return jsonify({
            "balance": team.balance,
            "team_name": team.name
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/payment-requests/check/<int:team_id>', methods=['GET'])
def check_payment_request(team_id):
    try:
        user_id = request.headers.get('user_id')
        action = request.headers.get('action', 'do_payment')  # Por defecto es do_payment

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Verificar si ya existe una solicitud activa y pendiente para este usuario y equipo
        existing_request = Application.query.filter_by(
            userID=int(user_id),
            teamID=team_id,
            action=ActionEnum[action],
            active=True,
            status=StatusEnum.pending
        ).first()

        has_requested = existing_request is not None
        return jsonify({"hasRequested": has_requested}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/payment-requests', methods=['POST'])
def create_payment_request():
    try:
        data = request.get_json()
        print('Datos recibidos:', data)  # Log para depuración
        
        user_id = data.get('user_id')
        team_id = data.get('team_id')
        amount = data.get('amount')
        bank = data.get('bank')
        reference = data.get('reference')
        cedula = data.get('cedula')
        phone_number = data.get('phone_number')
        payment_type = data.get('payment_type', 'incoming')
        action = data.get('action', 'do_payment')  # Por defecto es do_payment

        # Validar que todos los campos requeridos estén presentes
        required_fields = {
            'user_id': user_id,
            'team_id': team_id,
            'amount': amount,
            'bank': bank,
            'cedula': cedula,
            'phone_number': phone_number
        }
        
        # Solo requerir referencia para pagos entrantes
        if payment_type == 'incoming':
            required_fields['reference'] = reference
        
        missing_fields = [field for field, value in required_fields.items() if not value]
        if missing_fields:
            return jsonify({"error": f"Faltan datos requeridos: {', '.join(missing_fields)}"}), 400

        # Convertir el nombre del banco al formato correcto
        try:
            bank_enum = BankEnum[bank]
        except KeyError:
            return jsonify({"error": f"Banco inválido: {bank}"}), 400

        # Primero crear la solicitud
        new_request = Application(
            userID=user_id,
            teamID=team_id,
            action=ActionEnum[action],
            status=StatusEnum.pending,
            active=True
        )
        db.session.add(new_request)
        db.session.commit()

        # Luego crear el pago con el ID de la aplicación
        new_payment = Payment(
            user_id=user_id,
            application_id=new_request.id,
            type=PaymentTypeEnum[payment_type],
            amount=amount,
            bank=bank_enum,
            reference=reference,
            cedula=cedula,
            phone_number=phone_number
        )
        db.session.add(new_payment)
        db.session.commit()

        # Actualizar la aplicación con el ID del pago
        new_request.payment = new_payment.id
        db.session.commit()

        return jsonify({
            "message": "Solicitud de pago creada exitosamente",
            "payment_id": new_payment.id,
            "application_id": new_request.id
        }), 201
    except Exception as e:
        db.session.rollback()
        print('Error:', str(e))  # Log para depuración
        return jsonify({"error": str(e)}), 400

@api.route('/admin/payment-requests', methods=['GET'])
def get_payment_requests():
    try:
        # Obtener todas las solicitudes de pago pendientes
        applications = Application.query.filter(
            Application.active == True,
            Application.status == StatusEnum.pending,
            Application.action.in_([ActionEnum.do_payment, ActionEnum.receive_payment])
        ).all()

        # Serializar las solicitudes incluyendo información del usuario y el pago
        applications_data = []
        for app in applications:
            payment = Payment.query.filter_by(application_id=app.id).first()
            user = User.query.get(app.userID)
            team = Team.query.get(app.teamID)
            
            app_data = app.serialize()
            app_data['payment_details'] = payment.serialize() if payment else None
            app_data['user_name'] = f"{user.first_name} {user.last_name}" if user else None
            app_data['team_name'] = team.name if team else None
            applications_data.append(app_data)

        return jsonify(applications_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/users/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    try:
        # Verificar que el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Obtener las estadísticas del usuario
        stats = User_Stats.query.filter_by(user_id=user_id).first()
        if not stats:
            # Si no existen estadísticas, crear unas nuevas
            stats = User_Stats(
                user_id=user_id,
                team_id=None,
                kills=0,
                assists=0
            )
            db.session.add(stats)
            db.session.commit()

        return jsonify(stats.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/teams/<int:team_id>/stats', methods=['GET'])
def get_team_stats(team_id):
    try:
        # Verificar que el equipo existe
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Equipo no encontrado"}), 404

        # Obtener las estadísticas del equipo
        stats = Team_Stats.query.filter_by(team_id=team_id).first()
        if not stats:
            # Si no existen estadísticas, crear unas nuevas
            stats = Team_Stats(
                team_id=team_id,
                games_win=0,
                games_lose=0,
                games_count=0,
                tournament_win=0,
                tournament_loses=0,
                tournament_count=0,
                total_kills=0,
                total_assists=0,
                total_deaths=0
            )
            db.session.add(stats)
            db.session.commit()

        return jsonify(stats.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route('/teams/leave', methods=['POST'])
def leave_team():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        new_leader_id = data.get('new_leader_id')  # Opcional, solo necesario si hay más miembros

        if not user_id:
            return jsonify({"error": "Se requiere el ID del usuario"}), 400

        # Obtener el usuario y verificar que sea líder
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if not user.is_leader:
            return jsonify({"error": "Solo los líderes pueden salir del equipo"}), 403

        # Obtener el equipo
        team = Team.query.get(user.team_id)
        if not team:
            return jsonify({"error": "Equipo no encontrado"}), 404

        # Obtener todos los miembros del equipo
        team_members = User.query.filter_by(team_id=team.id).all()
        
        # Si hay más miembros, se requiere un nuevo líder
        if len(team_members) > 1:
            if not new_leader_id:
                return jsonify({"error": "Se requiere designar un nuevo líder"}), 400

            new_leader = User.query.get(new_leader_id)
            if not new_leader or new_leader.team_id != team.id:
                return jsonify({"error": "El nuevo líder debe ser un miembro del equipo"}), 400

            # Designar nuevo líder
            new_leader.is_leader = True
        else:
            # Si es el último miembro, desactivar el equipo
            team.is_active = False

        # Actualizar el usuario que sale
        user.team_id = None
        user.is_in_team = False
        user.is_leader = False

        db.session.commit()

        return jsonify({
            "message": "Has salido del equipo exitosamente",
            "team_disabled": len(team_members) <= 1
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400