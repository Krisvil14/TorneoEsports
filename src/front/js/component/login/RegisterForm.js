import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
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

    const notification = toast.loading('Registrando usuario...');

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
        navigate('/inicio');
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
        <h1 className="w-75 mx-auto fs-1">Registrar usuario en el sistema</h1>
      </div>
      <div className="row gy-3">
        <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
          <label htmlFor="first_name">Nombre:</label>
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
          <label htmlFor="last_name">Apellido:</label>
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
          <label htmlFor="cedula">Cédula:</label>
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
          <label htmlFor="age">Edad:</label>
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
          <label htmlFor="email">Correo Electrónico:</label>
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
          <label htmlFor="password">Contraseña:</label>
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
        <button type="submit" className="btn btn-primary w-75 mx-auto">
          Registrar Usuario
        </button>
        <Link to="/login" className="btn btn-secondary w-75 mx-auto">
        Volver
        </Link>
      </div>
    </form>
  );
}
