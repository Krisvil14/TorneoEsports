from flask import jsonify, url_for
from api.models import User, Team, Tournament, Application, Payment, PaymentTypeEnum, StatusEnum, ActionEnum, User_Stats, db

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

def approved_join_tournament(application):
    team = Team.query.get(application.teamID)
    tournament = Tournament.query.get(application.tournamentID)
    
    # Verificar que el equipo tenga suficiente balance
    if team.balance is None or team.balance < tournament.cost:
        raise APIException("El equipo no tiene suficiente balance para unirse al torneo", status_code=400)
    
    # Actualizar el balance del equipo
    team.balance -= tournament.cost
    team.tournament_id = tournament.id
    application.status = 'approved'

    # Desactivar la aplicación
    application.active = False

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