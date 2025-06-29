from flask import current_app
from flask_mail import Mail, Message
import pyotp
from datetime import datetime, timedelta
import os
import random

# Crear una única instancia de Mail
mail = Mail()

def init_mail(app):
    """Inicializa la configuración del email"""
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')
    mail.init_app(app)

def generate_otp():
    """Genera un código OTP numérico de 6 dígitos"""
    otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    return otp

def send_verification_email(user_email, otp_code):
    """Envía el email de verificación con el código OTP"""
    msg = Message(
        'Verificación de Email - KuaiMiss',
        recipients=[user_email]
    )
    
    msg.html = f"""
    <html>
        <body>
            <h2>Verificación de Email</h2>
            <p>Gracias por registrarte en nuestra plataforma. Tu código de verificación es:</p>
            <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">{otp_code}</h1>
            <p>Este código expirará en 10 minutos.</p>
            <p>Si no solicitaste este código, por favor ignora este email.</p>
        </body>
    </html>
    """
    
    try:
        mail.send(msg)
        return True
    except Exception as e:
        return False

def send_team_application_notification(user_email, user_name, team_name, is_accepted, leader_name=None):
    """Envía notificación sobre solicitud para unirse a equipo"""
    status = "aceptada" if is_accepted else "rechazada"
    color = "#4CAF50" if is_accepted else "#f44336"
    icon = "✅" if is_accepted else "❌"
    
    msg = Message(
        f'Solicitud para unirse a equipo {status} - KuaiMiss',
        recipients=[user_email]
    )
    
    msg.html = f"""
    <html>
        <body>
            <h2>{icon} Solicitud para unirse a equipo {status}</h2>
            <p>Hola <strong>{user_name}</strong>,</p>
            <p>Tu solicitud para unirte al equipo <strong style="color: {color};">{team_name}</strong> ha sido <strong style="color: {color};">{status}</strong>.</p>
            
            {f'<p>El líder del equipo <strong>{leader_name}</strong> ha tomado esta decisión.</p>' if leader_name else ''}
            
            {f'''
            <div style="background-color: #e8f5e8; border-left: 4px solid {color}; padding: 15px; margin: 20px 0;">
                <h3 style="color: {color}; margin-top: 0;">¡Bienvenido al equipo!</h3>
                <p>Ya puedes acceder a las funciones del equipo y participar en torneos junto a tus compañeros.</p>
            </div>
            ''' if is_accepted else f'''
            <div style="background-color: #ffebee; border-left: 4px solid {color}; padding: 15px; margin: 20px 0;">
                <h3 style="color: {color}; margin-top: 0;">Solicitud rechazada</h3>
                <p>No te desanimes, puedes buscar otros equipos disponibles o crear tu propio equipo.</p>
            </div>
            '''}
            
            <p>Gracias por usar nuestra plataforma.</p>
            <p>Saludos,<br>Equipo KuaiMiss</p>
        </body>
    </html>
    """
    
    try:
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error enviando email de notificación de equipo: {str(e)}")
        return False

def send_tournament_application_notification(leader_email, leader_name, team_name, tournament_name, is_accepted, admin_name="Administrador"):
    """Envía notificación sobre solicitud para unirse a torneo"""
    status = "aceptada" if is_accepted else "rechazada"
    color = "#4CAF50" if is_accepted else "#f44336"
    icon = "✅" if is_accepted else "❌"
    
    msg = Message(
        f'Solicitud para torneo {status} - KuaiMiss',
        recipients=[leader_email]
    )
    
    msg.html = f"""
    <html>
        <body>
            <h2>{icon} Solicitud para torneo {status}</h2>
            <p>Hola <strong>{leader_name}</strong>,</p>
            <p>La solicitud de tu equipo <strong>{team_name}</strong> para participar en el torneo <strong style="color: {color};">{tournament_name}</strong> ha sido <strong style="color: {color};">{status}</strong>.</p>
            
            <p>El {admin_name} ha tomado esta decisión.</p>
            
            {f'''
            <div style="background-color: #e8f5e8; border-left: 4px solid {color}; padding: 15px; margin: 20px 0;">
                <h3 style="color: {color}; margin-top: 0;">¡Equipo aceptado en el torneo!</h3>
                <p>Tu equipo ha sido registrado exitosamente en el torneo. Prepárate para la competencia y buena suerte.</p>
            </div>
            ''' if is_accepted else f'''
            <div style="background-color: #ffebee; border-left: 4px solid {color}; padding: 15px; margin: 20px 0;">
                <h3 style="color: {color}; margin-top: 0;">Solicitud rechazada</h3>
                <p>Tu equipo no cumple con los requisitos para participar en este torneo. Revisa los criterios y vuelve a intentar.</p>
            </div>
            '''}
            
            <p>Gracias por usar nuestra plataforma.</p>
            <p>Saludos,<br>Equipo KuaiMiss</p>
        </body>
    </html>
    """
    
    try:
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error enviando email de notificación de torneo: {str(e)}")
        return False

def send_payment_application_notification(leader_email, leader_name, team_name, payment_type, amount, is_accepted, admin_name="Administrador"):
    """Envía notificación sobre solicitud de pago"""
    status = "aprobada" if is_accepted else "rechazada"
    color = "#4CAF50" if is_accepted else "#f44336"
    icon = "✅" if is_accepted else "❌"
    payment_text = "pago entrante" if payment_type == "do_payment" else "solicitud de pago"
    
    msg = Message(
        f'Solicitud de {payment_text} {status} - KuaiMiss',
        recipients=[leader_email]
    )
    
    msg.html = f"""
    <html>
        <body>
            <h2>{icon} Solicitud de {payment_text} {status}</h2>
            <p>Hola <strong>{leader_name}</strong>,</p>
            <p>La solicitud de {payment_text} por <strong style="color: {color};">${amount}</strong> para tu equipo <strong>{team_name}</strong> ha sido <strong style="color: {color};">{status}</strong>.</p>
            
            <p>El {admin_name} ha tomado esta decisión.</p>
            
            {f'''
            <div style="background-color: #e8f5e8; border-left: 4px solid {color}; padding: 15px; margin: 20px 0;">
                <h3 style="color: {color}; margin-top: 0;">¡Pago procesado exitosamente!</h3>
                <p>El monto ha sido agregado a tu balance de equipo y ya puedes utilizarlo para participar en torneos.</p>
            </div>
            ''' if is_accepted else f'''
            <div style="background-color: #ffebee; border-left: 4px solid {color}; padding: 15px; margin: 20px 0;">
                <h3 style="color: {color}; margin-top: 0;">Solicitud rechazada</h3>
                <p>La solicitud no cumple con los requisitos. Por favor, verifica la información y vuelve a intentar.</p>
            </div>
            '''}
            
            <p>Gracias por usar nuestra plataforma.</p>
            <p>Saludos,<br>Equipo KuaiMiss</p>
        </body>
    </html>
    """
    
    try:
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error enviando email de notificación de pago: {str(e)}")
        return False

def verify_otp(user, otp_code):
   

    if not user.otp_code or not user.otp_expires:
      
        return False

    # Convertir ambas fechas a UTC naive para comparar
    current_time = datetime.utcnow()
    expiration_time = user.otp_expires.replace(tzinfo=None)

    if current_time > expiration_time:
        return False

    # Limpiar espacios y convertir a mayúsculas para la comparación
    received_code = str(otp_code).strip().upper()
    stored_code = str(user.otp_code).strip().upper()


    is_valid = received_code == stored_code


    return is_valid

def set_otp_for_user(user):
    """Genera y establece un nuevo código OTP para el usuario"""
    otp_code = generate_otp()
    user.otp_code = otp_code
    # Establecer la fecha de expiración en UTC
    user.otp_expires = datetime.utcnow() + timedelta(minutes=10)

    return otp_code 