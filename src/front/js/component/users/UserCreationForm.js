import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
      const response = await fetch(process.env.BACKEND_URL + '/api/register', {
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
        navigate('/users');
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
    <form onSubmit={handleSubmit}>
      <div className="row mb-4 text-center">
        <h1 className="w-75 mx-auto fs-1">Crear Usuario</h1>
      </div>
      <div className="row gy-3">
        <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
          <label for="first_name">Nombre:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={name}
            onChange={({ target }) => setName(target.value)}
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
            value={lastName}
            name="last_name"
            required
            onChange={({ target }) => setLastName(target.value)}
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="cedula">Cédula:</label>
          <input
            onChange={({ target }) => setDni(target.value)}
            value={dni}
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
            onChange={({ target }) => setAge(target.value)}
            value={age}
            className="form-control"
            type="number"
            id="age"
            name="age"
            required
          />
        </div>
         <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label htmlFor="role">Rol:</label>
          <select
            className="form-control"
            id="role"
            name="role"
            onChange={({ target }) => setRole(target.value)}
            required
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto">
          <label for="email">Correo Electrónico:</label>
          <input
            onChange={({ target }) => setEmail(target.value)}
            value={email}
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
            onChange={({ target }) => setPassword(target.value)}
            value={password}
            className="form-control"
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <div className="d-flex w-75 justify-content-center flex-column flex-md-row gap-2 mx-auto">
          <button type="submit" className="btn btn-primary w-100 w-md-75">
            Crear Usuario
          </button>
          <Link to="/users" className="btn btn-secondary w-100 w-md-75">
            Volver
          </Link>
        </div>
      </div>
    </form>
  );
}
