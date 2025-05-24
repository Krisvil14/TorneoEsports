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
    print(f"OTP generado: {otp}")
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
        print(f"Error sending email: {str(e)}")
        return False

def verify_otp(user, otp_code):
    """
    Verifica si el código OTP es válido y no ha expirado
    """
    print(f"\n=== Verificación de OTP ===")
    print(f"Email del usuario: {user.email}")
    print(f"OTP recibido: '{otp_code}'")
    print(f"OTP almacenado: '{user.otp_code}'")
    print(f"Tiempo de expiración: {user.otp_expires}")
    print(f"Tiempo actual: {datetime.utcnow()}")

    if not user.otp_code or not user.otp_expires:
        print("Error: No hay código OTP o tiempo de expiración almacenado")
        return False

    # Convertir ambas fechas a UTC naive para comparar
    current_time = datetime.utcnow()
    expiration_time = user.otp_expires.replace(tzinfo=None)

    if current_time > expiration_time:
        print("Error: El código OTP ha expirado")
        return False

    # Limpiar espacios y convertir a mayúsculas para la comparación
    received_code = str(otp_code).strip().upper()
    stored_code = str(user.otp_code).strip().upper()

    print(f"OTP recibido (limpio): '{received_code}'")
    print(f"OTP almacenado (limpio): '{stored_code}'")

    is_valid = received_code == stored_code
    print(f"¿El código es válido?: {is_valid}")

    return is_valid

def set_otp_for_user(user):
    """Genera y establece un nuevo código OTP para el usuario"""
    otp_code = generate_otp()
    user.otp_code = otp_code
    # Establecer la fecha de expiración en UTC
    user.otp_expires = datetime.utcnow() + timedelta(minutes=10)
    print(f"OTP establecido para usuario {user.email}: {otp_code}")
    print(f"Expira en: {user.otp_expires}")
    return otp_code 