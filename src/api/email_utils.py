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
        'Verificación de Email - Gaming Platform',
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