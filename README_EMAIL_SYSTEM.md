# Sistema de Notificaciones por Email - Gaming Platform

## 🎯 Resumen

Este sistema implementa notificaciones automáticas por email para mantener informados a los usuarios sobre el estado de sus solicitudes en la plataforma de gaming.

## ✨ Características

- **Notificaciones automáticas** cuando se procesan solicitudes
- **Plantillas HTML personalizadas** con diseño atractivo
- **Manejo robusto de errores** que no interrumpe el flujo principal
- **Soporte para múltiples tipos** de solicitudes
- **Configuración flexible** mediante variables de entorno

## 📧 Tipos de Notificaciones

### 1. Solicitud para Unirse a Equipo
- **Destinatario**: Jugador que solicitó unirse
- **Remitente**: Líder del equipo
- **Contenido**: Confirmación de aceptación/rechazo con detalles del equipo

### 2. Solicitud para Unirse a Torneo
- **Destinatario**: Líder del equipo
- **Remitente**: Administrador
- **Contenido**: Confirmación de aceptación/rechazo con detalles del torneo

### 3. Solicitud de Pago
- **Destinatario**: Líder del equipo
- **Remitente**: Administrador
- **Contenido**: Confirmación de aprobación/rechazo con detalles del pago

## 🚀 Instalación y Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion
```

### 2. Configuración de Gmail

1. **Habilita la verificación en dos pasos** en tu cuenta de Google
2. **Genera una contraseña de aplicación**:
   - Ve a Configuración de la cuenta de Google
   - Seguridad > Verificación en dos pasos
   - Contraseñas de aplicación
   - Genera una nueva contraseña para "Gaming Platform"
3. **Usa esa contraseña** en la variable `MAIL_PASSWORD`

### 3. Verificación

Ejecuta el script de prueba para verificar la configuración:

```bash
python test_email_notifications.py
```

## 📁 Estructura de Archivos

```
src/
├── api/
│   ├── email_utils.py          # Funciones de envío de emails
│   └── routes.py              # Integración en el flujo de solicitudes
docs/
└── EMAIL_NOTIFICATIONS.md     # Documentación técnica detallada
test_email_notifications.py    # Script de pruebas
README_EMAIL_SYSTEM.md         # Este archivo
```

## 🔧 Uso

### Envío Automático

Las notificaciones se envían automáticamente cuando:

1. **Un líder acepta/rechaza** una solicitud para unirse a su equipo
2. **Un administrador acepta/rechaza** una solicitud para participar en un torneo
3. **Un administrador aprueba/rechaza** una solicitud de pago

### Envío Manual

Para enviar notificaciones manualmente:

```python
from api.email_utils import send_team_application_notification

# Ejemplo de notificación de equipo
send_team_application_notification(
    user_email="usuario@example.com",
    user_name="Juan Pérez",
    team_name="Los Invictos",
    is_accepted=True,
    leader_name="María García"
)
```

## 🎨 Plantillas de Email

### Características Visuales

- **Colores temáticos**: Verde para aceptación, Rojo para rechazo
- **Iconos Unicode**: ✅ para éxito, ❌ para rechazo
- **Cajas de estado**: Fondo coloreado según el resultado
- **Diseño responsive**: Compatible con diferentes clientes de email

### Estructura HTML

```html
<html>
    <body>
        <h2>Icono + Título</h2>
        <p>Saludo personalizado</p>
        <p>Información de la solicitud</p>
        <div class="status-box">
            <h3>Estado de la solicitud</h3>
            <p>Mensaje específico según el resultado</p>
        </div>
        <p>Firma</p>
    </body>
</html>
```

## 🛡️ Seguridad

### Mejores Prácticas

- ✅ **Contraseñas de aplicación** en lugar de contraseñas normales
- ✅ **Variables de entorno** para credenciales sensibles
- ✅ **Validación de destinatarios** antes del envío
- ✅ **Manejo de errores** sin exponer información sensible
- ✅ **Rate limiting** (considerar implementar)

### Consideraciones

- 🔒 Las contraseñas de aplicación no deben compartirse
- 🔒 Los emails contienen información sensible
- 🔒 Verificar que los destinatarios sean válidos
- 🔒 Monitorear logs de errores regularmente

## 🧪 Pruebas

### Script de Pruebas

```bash
# Ejecutar todas las pruebas
python test_email_notifications.py

# Verificar configuración
python test_email_notifications.py --check-config
```

### Pruebas Manuales

1. **Crear una solicitud** para unirse a un equipo
2. **Aceptar/rechazar** desde la interfaz del líder
3. **Verificar** que se reciba el email correspondiente

## 📊 Monitoreo

### Logs de Error

Los errores se registran con el formato:
```
Error enviando notificación de [tipo]: [descripción del error]
```

### Métricas a Monitorear

- Tasa de entrega de emails
- Errores de envío
- Tiempo de respuesta del servidor SMTP
- Uso de cuota de emails

## 🔄 Mantenimiento

### Actualizaciones

Para agregar nuevos tipos de notificaciones:

1. **Crear función** en `email_utils.py`
2. **Integrar lógica** en `handle_application`
3. **Actualizar documentación**
4. **Agregar pruebas**

### Backup y Recuperación

- **Respaldar** configuración de email
- **Documentar** procedimientos de recuperación
- **Probar** restauración periódicamente

## 🆘 Solución de Problemas

### Problemas Comunes

#### Error de Autenticación
```
Error enviando notificación: (535, b'5.7.8 Username and Password not accepted')
```
**Solución**: Verificar contraseña de aplicación de Gmail

#### Error de Conexión
```
Error enviando notificación: [Errno 11001] getaddrinfo failed
```
**Solución**: Verificar conectividad a internet y configuración SMTP

#### Email no Recibido
- Verificar carpeta de spam
- Confirmar dirección de email correcta
- Revisar logs de error

### Contacto

Para soporte técnico o preguntas sobre el sistema de notificaciones:
- Revisar documentación en `docs/EMAIL_NOTIFICATIONS.md`
- Verificar logs de error
- Ejecutar script de pruebas

## 📈 Roadmap

### Próximas Mejoras

- [ ] **Plantillas personalizables** por administrador
- [ ] **Notificaciones push** en la aplicación web
- [ ] **Cola de emails** para mejor rendimiento
- [ ] **Métricas detalladas** de entrega
- [ ] **Soporte para múltiples proveedores** de email

### Versiones Futuras

- **v2.0**: Sistema de cola de emails
- **v2.1**: Plantillas personalizables
- **v2.2**: Integración con notificaciones push
- **v3.0**: Dashboard de métricas de email

---

**Desarrollado para Gaming Platform** 🎮 