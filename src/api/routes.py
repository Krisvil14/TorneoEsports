"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
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


@api.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    admin_id = data.get('admin_id')  # ID del administrador que realiza la solicitud

    if not email or not password or not role or not admin_id:
        return jsonify({"error": "Faltan datos"}), 400

    # Validar la contraseña
    if not validate_password(password):
        return jsonify({"error": "La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número"}), 400

    # Verificar que el email sea único
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    # Verificar el rol del usuario que realiza la solicitud
    admin_user = User.query.get(admin_id)
    if not admin_user or admin_user.role != RoleEnum.admin:
        return jsonify({"error": "Solo un administrador puede registrar a otro administrador"}), 403

    # Crear el nuevo usuario
    new_user = User(email=email, password=password, role=RoleEnum[role], is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201