from flask import Flask, request, jsonify, url_for, Blueprint, render_template
from api.models import db, User, RoleEnum
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

    return jsonify({"message": "Inicio de sesión exitoso"}), 200

@api.route('/recovery', methods=['POST'])
def recover_user():
    data = request.form

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Introduzca todos los campos"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify({"message": "Recuperacion de usuario en curso..."}), 200


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
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

