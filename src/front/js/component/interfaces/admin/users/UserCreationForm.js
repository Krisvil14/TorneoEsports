import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../../../styles/gaming-form.css';

export default function CreateUserForm() {
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [dni, setDni] = React.useState('');
  const [age, setAge] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('first_name', name);
    formData.append('last_name', lastName);
    formData.append('cedula', dni);
    formData.append('age', age);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    const notification = toast.loading('Creando usuario...');

    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/admin/create_user', {
        method: 'POST',
        body: formData,
      });
      const { ok } = response;
      const json = await response.json();

      if (ok) {
        toast.update(notification, {
          render: 'Se ha registrado al usuario exitosamente',
          type: 'success',
          autoClose: 5000,
          isLoading: false,
        });
        navigate('/admin/users');
      } else {
        toast.update(notification, {
          render: json.error,
          type: 'error',
          autoClose: 5000,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="gaming-form-container">
      <form onSubmit={handleSubmit}>
        <div className="row mb-4 text-center">
          <h1 className="w-75 mx-auto fs-1 gaming-form-title">Crear Usuario</h1>
        </div>
        <div className="row gy-3">
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="first_name" className="gaming-form-label">Nombre:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
              className="form-control gaming-form-input"
            />
          </div>
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="last_name" className="gaming-form-label">Apellido:</label>
            <input
              type="text"
              id="last_name"
              value={lastName}
              name="last_name"
              required
              onChange={({ target }) => setLastName(target.value)}
              className="form-control gaming-form-input"
            />
          </div>
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="cedula" className="gaming-form-label">Cédula:</label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={dni}
              onChange={({ target }) => setDni(target.value)}
              required
              className="form-control gaming-form-input"
            />
          </div>
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="age" className="gaming-form-label">Edad:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={age}
              onChange={({ target }) => setAge(target.value)}
              required
              className="form-control gaming-form-input"
            />
          </div>
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="role" className="gaming-form-label">Rol:</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={({ target }) => setRole(target.value)}
              required
              className="form-control gaming-form-input"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="email" className="gaming-form-label">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              required
              className="form-control gaming-form-input"
            />
          </div>
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="password" className="gaming-form-label">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
              className="form-control gaming-form-input"
            />
          </div>
          <button type="submit" className="gaming-form-button primary w-75 mx-auto">
            Crear Usuario
          </button>
          <Link to="/admin/users" className="gaming-form-button secondary w-75 mx-auto">
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
}
