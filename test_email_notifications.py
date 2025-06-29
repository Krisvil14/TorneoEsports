#!/usr/bin/env python3
"""
Script de prueba para el sistema de notificaciones por email
"""

import os
import sys
from datetime import datetime

# Agregar el directorio src al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from api.email_utils import (
    send_team_application_notification,
    send_tournament_application_notification,
    send_payment_application_notification
)

def test_team_notification():
    """Prueba el envío de notificación de solicitud de equipo"""
    print("🧪 Probando notificación de solicitud de equipo...")
    
    # Caso de aceptación
    success = send_team_application_notification(
        user_email="test@example.com",
        user_name="Juan Pérez",
        team_name="Los Invictos",
        is_accepted=True,
        leader_name="María García"
    )
    
    if success:
        print("✅ Email de aceptación de equipo enviado correctamente")
    else:
        print("❌ Error al enviar email de aceptación de equipo")
    
    # Caso de rechazo
    success = send_team_application_notification(
        user_email="test@example.com",
        user_name="Juan Pérez",
        team_name="Los Invictos",
        is_accepted=False,
        leader_name="María García"
    )
    
    if success:
        print("✅ Email de rechazo de equipo enviado correctamente")
    else:
        print("❌ Error al enviar email de rechazo de equipo")

def test_tournament_notification():
    """Prueba el envío de notificación de solicitud de torneo"""
    print("\n🏆 Probando notificación de solicitud de torneo...")
    
    # Caso de aceptación
    success = send_tournament_application_notification(
        leader_email="leader@example.com",
        leader_name="María García",
        team_name="Los Invictos",
        tournament_name="Torneo de Verano 2024",
        is_accepted=True
    )
    
    if success:
        print("✅ Email de aceptación de torneo enviado correctamente")
    else:
        print("❌ Error al enviar email de aceptación de torneo")
    
    # Caso de rechazo
    success = send_tournament_application_notification(
        leader_email="leader@example.com",
        leader_name="María García",
        team_name="Los Invictos",
        tournament_name="Torneo de Verano 2024",
        is_accepted=False
    )
    
    if success:
        print("✅ Email de rechazo de torneo enviado correctamente")
    else:
        print("❌ Error al enviar email de rechazo de torneo")

def test_payment_notification():
    """Prueba el envío de notificación de solicitud de pago"""
    print("\n💰 Probando notificación de solicitud de pago...")
    
    # Caso de pago entrante aprobado
    success = send_payment_application_notification(
        leader_email="leader@example.com",
        leader_name="María García",
        team_name="Los Invictos",
        payment_type="do_payment",
        amount=50,
        is_accepted=True
    )
    
    if success:
        print("✅ Email de pago entrante aprobado enviado correctamente")
    else:
        print("❌ Error al enviar email de pago entrante aprobado")
    
    # Caso de solicitud de pago rechazada
    success = send_payment_application_notification(
        leader_email="leader@example.com",
        leader_name="María García",
        team_name="Los Invictos",
        payment_type="receive_payment",
        amount=25,
        is_accepted=False
    )
    
    if success:
        print("✅ Email de solicitud de pago rechazada enviado correctamente")
    else:
        print("❌ Error al enviar email de solicitud de pago rechazada")

def check_environment():
    """Verifica que las variables de entorno estén configuradas"""
    print("🔧 Verificando configuración del entorno...")
    
    required_vars = ['MAIL_USERNAME', 'MAIL_PASSWORD']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Variables de entorno faltantes: {', '.join(missing_vars)}")
        print("\nPara configurar las variables de entorno:")
        print("1. Crea un archivo .env en la raíz del proyecto")
        print("2. Agrega las siguientes líneas:")
        print("   MAIL_USERNAME=tu_email@gmail.com")
        print("   MAIL_PASSWORD=tu_contraseña_de_aplicacion")
        print("3. Asegúrate de que el archivo .env esté en .gitignore")
        return False
    else:
        print("✅ Variables de entorno configuradas correctamente")
        return True

def main():
    """Función principal del script de prueba"""
    print("🚀 Iniciando pruebas del sistema de notificaciones por email")
    print("=" * 60)
    
    # Verificar configuración
    if not check_environment():
        print("\n❌ No se pueden ejecutar las pruebas sin la configuración adecuada")
        return
    
    print(f"\n📅 Fecha y hora de la prueba: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Ejecutar pruebas
        test_team_notification()
        test_tournament_notification()
        test_payment_notification()
        
        print("\n" + "=" * 60)
        print("🎉 Todas las pruebas completadas")
        print("\n📝 Nota: Los emails se envían a direcciones de prueba.")
        print("   Para pruebas reales, cambia las direcciones de email en el script.")
        
    except Exception as e:
        print(f"\n❌ Error durante las pruebas: {str(e)}")
        print("Verifica que el servidor de email esté configurado correctamente.")

if __name__ == "__main__":
    main() 