import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Link } from 'react-router-dom';
import '../../../styles/gaming-form.css';


export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const state = React.useContext(Context);

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
            state.actions.login(json.user);
            toast.update(notification, {
              render: 'Sesion iniciada con exito',
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
        <div className="gaming-form-container">
          <form onSubmit={handleSubmit}>
            <div className="row mb-4 text-center">
              <h1 className="w-75 mx-auto fs-1 gaming-form-title">Ingresar al sistema</h1>
            </div>
            <div className="row gy-3">
              <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
                <label htmlFor="email" className="gaming-form-label">Correo:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  required
                  className="form-control gaming-form-input"
                />
              </div>
              <div className="d-flex flex-column gy-3 w-75 mx-auto">
                <label htmlFor="password" className="gaming-form-label">Contraseña:</label>
                <input
                  onChange={({ target }) => setPassword(target.value)}
                  value={password}
                  className="form-control gaming-form-input"
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>
              <button type="submit" className="gaming-form-button primary w-75 mx-auto">
                Ingresar al sistema
              </button>
              <Link to="/registrar" className="gaming-form-button secondary w-75 mx-auto">
                Registrar Usuario
              </Link>
            </div>
          </form>
        </div>
      );
};
