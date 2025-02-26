import React from 'react';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const notification = toast.loading('Iniciando sesion...');
    
        try {
          const response = await fetch(process.env.BACKEND_URL + '/api/login', {
            method: 'POST',
            body: formData,
          });
          const { ok } = response;
          const json = await response.json();
    
          if (ok) {
            toast.update(notification, {
              render: 'Sesion iniciada con exito',
              type: 'success',
              autoClose: 5000,
              isLoading: false,
            });
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
            <h1 className="w-75 mx-auto fs-1">Ingresar al sistema</h1>
          </div>
          <div className="row gy-3">
            <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
              <label for="email">Correo:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                required
                className="form-control"
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
            <button type="submit" class="btn btn-primary w-75 mx-auto">
            Primary
            </button>
            </div>
        </form>
        );
};
