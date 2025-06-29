# Sistema de Notificaciones por Email

## Descripción General

El sistema de notificaciones por email permite enviar correos automáticos cuando se procesan solicitudes en la plataforma de gaming. Esto mejora la experiencia del usuario al mantenerlos informados sobre el estado de sus solicitudes.

## Tipos de Notificaciones

### 1. Solicitud para Unirse a Equipo

**Cuándo se envía:**
- Cuando un líder de equipo acepta o rechaza la solicitud de un jugador para unirse al equipo

**Destinatario:**
- El jugador que solicitó unirse al equipo

**Contenido del email:**
- Confirmación de aceptación o rechazo
- Nombre del equipo
- Nombre del líder que tomó la decisión
- Mensaje motivacional según el resultado

**Función utilizada:**
```python
send_team_application_notification(user_email, user_name, team_name, is_accepted, leader_name)
```

### 2. Solicitud para Unirse a Torneo

**Cuándo se envía:**
- Cuando un administrador acepta o rechaza la solicitud de un equipo para participar en un torneo

**Destinatario:**
- El líder del equipo que solicitó participar

**Contenido del email:**
- Confirmación de aceptación o rechazo
- Nombre del torneo
- Nombre del equipo
- Información sobre el estado del torneo

**Función utilizada:**
```python
send_tournament_application_notification(leader_email, leader_name, team_name, tournament_name, is_accepted)
```

### 3. Solicitud de Pago

**Cuándo se envía:**
- Cuando un administrador aprueba o rechaza una solicitud de pago (entrante o saliente)

**Destinatario:**
- El líder del equipo que realizó la solicitud de pago

**Contenido del email:**
- Confirmación de aprobación o rechazo
- Tipo de pago (entrante o saliente)
- Monto solicitado
- Estado del balance del equipo

**Función utilizada:**
```python
send_payment_application_notification(leader_email, leader_name, team_name, payment_type, amount, is_accepted)
```

## Configuración

### Variables de Entorno Requeridas

```bash
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion
```

### Configuración de Gmail

Para usar Gmail como servidor SMTP, necesitas:

1. Habilitar la verificación en dos pasos en tu cuenta de Google
2. Generar una contraseña de aplicación específica para esta aplicación
3. Usar esa contraseña en la variable `MAIL_PASSWORD`

## Implementación Técnica

### Archivos Modificados

1. **`src/api/email_utils.py`**
   - Nuevas funciones de envío de notificaciones
   - Plantillas HTML para cada tipo de email

2. **`src/api/routes.py`**
   - Modificación de la función `handle_application`
   - Integración de envío de emails en el flujo de procesamiento

### Flujo de Procesamiento

1. Se recibe una solicitud para procesar una aplicación
2. Se identifica el tipo de solicitud (join_team, join_tournament, payment)
3. Se obtienen los datos necesarios (usuario, equipo, torneo, pago)
4. Se envía el email de notificación correspondiente
5. Se procesa la solicitud normalmente
6. Si falla el envío de email, se registra el error pero no se interrumpe el proceso

### Manejo de Errores

- Los errores en el envío de email se capturan y registran
- No se interrumpe el procesamiento principal de la solicitud
- Se mantiene la funcionalidad existente intacta

## Plantillas de Email

### Estructura HTML

Todas las plantillas siguen una estructura consistente:

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

### Elementos Visuales

- **Colores:** Verde (#4CAF50) para aceptación, Rojo (#f44336) para rechazo
- **Iconos:** ✅ para aceptación, ❌ para rechazo
- **Cajas de estado:** Fondo verde para aceptación, fondo rojo para rechazo

## Pruebas

### Verificación de Funcionamiento

1. **Solicitud de equipo:**
   - Crear una solicitud para unirse a un equipo
   - Aceptar/rechazar desde la interfaz del líder
   - Verificar que se reciba el email

2. **Solicitud de torneo:**
   - Crear una solicitud para participar en un torneo
   - Aceptar/rechazar desde el panel de administración
   - Verificar que el líder reciba el email

3. **Solicitud de pago:**
   - Crear una solicitud de pago
   - Aprobar/rechazar desde el panel de administración
   - Verificar que el líder reciba el email

### Logs de Error

Los errores en el envío de emails se registran en la consola con el formato:
```
Error enviando notificación de [tipo]: [descripción del error]
```

## Mantenimiento

### Monitoreo

- Revisar logs de errores de envío de email
- Verificar que las variables de entorno estén configuradas correctamente
- Monitorear la tasa de entrega de emails

### Actualizaciones

Para agregar nuevos tipos de notificaciones:

1. Crear nueva función en `email_utils.py`
2. Agregar la lógica de envío en `handle_application`
3. Actualizar esta documentación

## Consideraciones de Seguridad

- Las contraseñas de aplicación de Gmail no deben compartirse
- Los emails contienen información sensible, manejar con cuidado
- Considerar implementar rate limiting para evitar spam
- Verificar que los destinatarios sean válidos antes del envío 