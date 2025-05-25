from flask import jsonify, url_for
from api.models import User, Team, Match, Tournament, Application, Payment, PaymentTypeEnum, StatusEnum, ActionEnum, User_Stats, db
from datetime import datetime, timedelta

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

def create_brackets(team_ids, tournament_id, depth=0, is_final=False):
    try:
        print("\n=== Creando brackets ===")
        print(f"Profundidad: {depth}")
        print(f"Es final: {is_final}")
        print(f"IDs de equipos: {team_ids}")
        
        matches = []
        next_round_matches = []
        
        # Calcular la fecha programada (7 días desde ahora)
        scheduled_date = datetime.utcnow() + timedelta(days=7)
        
        # Primero creamos todos los partidos sin next_match_id
        for i in range(0, len(team_ids), 2):
            if i + 1 < len(team_ids):
                match = Match(
                    tournament_id=tournament_id,
                    team1_id=team_ids[i],
                    team2_id=team_ids[i+1],
                    score1=None,
                    score2=None,
                    next_match_id=None,  # Inicialmente sin next_match_id
                    depth=depth,
                    is_final=is_final
                )
                # Establecer la fecha programada en el calendario
                match.calendar.scheduled_date = scheduled_date
                matches.append(match)
                next_round_matches.append(match)
        
        # Guardamos los partidos para obtener sus IDs
        for match in matches:
            db.session.add(match)
        db.session.flush()
        
        # Ahora actualizamos los next_match_id
        if not is_final and len(next_round_matches) > 1:
            for i in range(0, len(next_round_matches), 2):
                if i + 1 < len(next_round_matches):
                    # Cada par de partidos se enfrentará en la siguiente ronda
                    next_round_matches[i].next_match_id = next_round_matches[i+1].id
                    next_round_matches[i+1].next_match_id = next_round_matches[i].id
        
        print(f"Partidos creados: {len(matches)}")
        return matches
        
    except Exception as e:
        print(f"Error al crear brackets: {str(e)}")
        db.session.rollback()
        raise APIException(f"Error al crear los brackets: {str(e)}", status_code=500)

def approved_join_team(application):
    user = User.query.get(application.userID)
    team = Team.query.get(application.teamID)
    
    # Actualizar el usuario
    user.team_id = team.id
    user.is_in_team = True 
    application.status = 'approved'
    application.active = False

    # Actualizar o crear las estadísticas del usuario
    user_stats = User_Stats.query.filter_by(user_id=user.id).first()
    if user_stats:
        user_stats.team_id = team.id
    else:
        # Si no existen las estadísticas, las creamos
        user_stats = User_Stats(
            user_id=user.id,
            team_id=team.id,
            kills=0,
            assists=0
        )
        db.session.add(user_stats)

    # Guardar los cambios
    db.session.commit()

def get_round_winners(tournament_id, depth):
    """
    Obtiene los ganadores de una ronda específica del torneo
    """
    matches = Match.query.filter_by(tournament_id=tournament_id, depth=depth).all()
    winners = []
    
    for match in matches:
        if match.score1 is None or match.score2 is None:
            continue
            
        if match.score1 > match.score2:
            winners.append(match.team1_id)
        else:
            winners.append(match.team2_id)
            
    return winners

def update_tournament_stats(team_id, is_winner):
    """
    Actualiza las estadísticas del equipo en el torneo
    """
    team_stats = Team_Stats.query.filter_by(team_id=team_id).first()
    if team_stats:
        team_stats.tournament_count += 1
        if is_winner:
            team_stats.tournament_win += 1
        else:
            team_stats.tournament_loses += 1
        db.session.commit()

def final_brackets(tournament_id, team1_id, team2_id, final_depth):
    """
    Maneja el partido final del torneo
    """
    # Calcular la fecha programada (7 días desde ahora)
    scheduled_date = datetime.utcnow() + timedelta(days=7)
    
    # Crear el partido final
    final_match = Match(
        tournament_id=tournament_id,
        team1_id=team1_id,
        team2_id=team2_id,
        score1=None,
        score2=None,
        next_match_id=None,
        depth=final_depth,
        is_final=True
    )
    
    # Establecer la fecha programada en el calendario
    final_match.calendar.scheduled_date = scheduled_date
    
    db.session.add(final_match)
    
    # Obtener el torneo
    tournament = Tournament.query.get(tournament_id)
    if not tournament:
        raise APIException("Torneo no encontrado", status_code=404)
    
    # Limpiar el torneo (remover equipos)
    for team in tournament.teams:
        team.tournament_id = None
    
    db.session.commit()
    return final_match

def approved_join_tournament(application):
    try:
        print("\n=== Procesando unión a torneo ===")
        team = Team.query.get(application.teamID)
        tournament = Tournament.query.get(application.tournamentID)
        
        if not team or not tournament:
            raise APIException("Equipo o torneo no encontrado", status_code=404)
        
        print(f"Equipo: {team.name}")
        print(f"Torneo: {tournament.name}")
        print(f"Balance actual: {team.balance}")
        print(f"Costo del torneo: {tournament.cost}")
        
        # Verificar que el equipo tenga suficiente balance
        if team.balance is None or team.balance < tournament.cost:
            raise APIException("El equipo no tiene suficiente balance para unirse al torneo", status_code=400)
        
        # Actualizar el balance del equipo
        team.balance -= tournament.cost
        team.tournament_id = tournament.id
        application.status = StatusEnum.approved
        application.active = False
        
        # Verificar si el torneo está lleno
        current_teams = len(tournament.teams)
        max_teams = tournament.num_max_teams
        print(f"Equipos actuales: {current_teams}")
        print(f"Máximo de equipos: {max_teams}")
        
        is_tournament_full = current_teams == max_teams
        if not is_tournament_full:
            print("Torneo no está lleno, guardando cambios...")
            db.session.commit()
            return
            
        print("Torneo lleno, iniciando brackets...")
        # Iniciar el torneo
        tournament.started = True
        
        try:
            # Crear los brackets iniciales
            team_ids = [team.id for team in tournament.teams]
            print(f"IDs de equipos: {team_ids}")
            
            if len(team_ids) < 2:
                raise APIException("Se necesitan al menos 2 equipos para crear los brackets", status_code=400)
                
            # Asegurarse de que el número de equipos sea par
            if len(team_ids) % 2 != 0:
                print("Número impar de equipos, agregando equipo fantasma...")
                team_ids.append(None)
                
            print("Creando brackets...")
            create_brackets(team_ids, tournament.id, 0)
            print("Brackets creados exitosamente")
            db.session.commit()
            
        except Exception as e:
            print(f"Error al crear brackets: {str(e)}")
            db.session.rollback()
            raise APIException(f"Error al crear los brackets: {str(e)}", status_code=500)
            
    except APIException as e:
        print(f"Error API: {str(e)}")
        raise e
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        db.session.rollback()
        raise APIException(f"Error al procesar la solicitud: {str(e)}", status_code=500)

def advance_tournament_round(tournament_id, current_depth):
    """
    Avanza al siguiente round del torneo
    """
    tournament = Tournament.query.get(tournament_id)
    if not tournament:
        raise APIException("Torneo no encontrado", status_code=404)
    
    # Obtener los ganadores de la ronda actual
    winners = get_round_winners(tournament_id, current_depth)
    
    # Si solo quedan 2 equipos, crear la final con depth+1
    if len(winners) == 2:
        final_brackets(tournament_id, winners[0], winners[1], current_depth + 1)
        db.session.commit()
        return
    
    # Si hay más de 2 equipos, crear la siguiente ronda con depth+1
    create_brackets(winners, tournament_id, current_depth + 1)
    db.session.commit()

def approved_do_payment(application):
    # Actualizar el estado de la aplicación a aprobado
    application.status = StatusEnum.approved
    
    # Obtener el equipo asociado a la aplicación
    team = Team.query.get(application.teamID)
    if not team:
        raise APIException("Equipo no encontrado", status_code=404)
    
    # Obtener los detalles del pago
    payment = Payment.query.filter_by(application_id=application.id).first()
    if not payment:
        raise APIException("Detalles del pago no encontrados", status_code=404)
    
    # Actualizar el balance del equipo
    if team.balance is None:
        team.balance = 0
    
    # Si es una solicitud de pago (do_payment), sumar 10 al balance
    if application.action == ActionEnum.do_payment:
        team.balance += 10
    # Si es una solicitud de recepción de pago (receive_payment), restar el monto solicitado del balance
    elif application.action == ActionEnum.receive_payment:
        if team.balance < payment.amount:
            raise APIException("El equipo no tiene suficiente balance", status_code=400)
        team.balance -= payment.amount
    
    # Actualizar el estado de la aplicación
    application.active = False
    
    # Guardar los cambios
    db.session.commit()