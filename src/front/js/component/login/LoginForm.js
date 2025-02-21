import React from 'react';

export default function LoginForm() {
  return (
    <div>
      <div className="row mb-4 text-center">
        <h1 className="w-75 mx-auto fs-1">Soy el form</h1>
      </div>
      <div className="row gy-3">
        <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
          <label for="first_name">Nombre:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            className="form-control"
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="last_name">Apellido:</label>
          <input
            className="form-control"
            type="text"
            id="last_name"
            name="last_name"
            required
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="cedula">Cédula:</label>
          <input
            className="form-control"
            type="text"
            id="cedula"
            name="cedula"
            required
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="age">Edad:</label>
          <input
            className="form-control"
            type="number"
            id="age"
            name="age"
            required
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="email">Correo Electrónico:</label>
          <input
            className="form-control"
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="password">Contraseña:</label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="role">Rol:</label>
          <select id="role" name="role" required className="form-control">
            <option value="admin">Administrador</option>
            <option value="player">Usuario</option>
          </select>
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="admin_id">ID del Administrador:</label>
          <input
            className="form-control"
            type="text"
            id="admin_id"
            name="admin_id"
            required
          />
        </div>
        <button type="button" class="btn btn-primary w-75 mx-auto">
          Primary
        </button>
      </div>
    </div>
  );
}
