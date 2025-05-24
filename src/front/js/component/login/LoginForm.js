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
  const { actions } = React.useContext(Context);

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
        actions.login(json.user);
        await actions.getUser();
        toast.update(notification, {
          render: 'Sesion iniciada con exito',
          type: 'success',
          autoClose: 5000,
          isLoading: false,
        });
        navigate('/inicio');
      } else {
        if (json.error === "Por favor, verifica tu email antes de iniciar sesión.") {
          // Obtener el ID del usuario por email
          const userResponse = await fetch(process.env.BACKEND_URL + '/api/users');
          const users = await userResponse.json();
          const user = users.find(u => u.email === email);
          
          if (user) {
            toast.update(notification, {
              render: () => (
                <div>
                  {json.error}
                  <br />
                  <button 
                    onClick={() => navigate('/verify-email', { state: { user_id: user.id } })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007bff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: '0',
                      marginTop: '5px'
                    }}
                  >
                    Pulsa aquí para verificar el email
                  </button>
                </div>
              ),
              type: 'error',
              autoClose: 10000,
              isLoading: false,
            });
          } else {
            toast.update(notification, {
              render: json.error,
              type: 'error',
              autoClose: 10000,
              isLoading: false,
            });
          }
        } else {
          toast.update(notification, {
            render: json.error,
            type: 'error',
            autoClose: 10000,
            isLoading: false,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="gaming-form-container">
      <form onSubmit={handleSubmit}>
        <div className="row mb-4 text-center">
          <h1 className="w-75 mx-auto fs-1 gaming-form-title">Iniciar Sesión</h1>
        </div>
        <div className="row gy-3">
          <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
            <label htmlFor="email" className="gaming-form-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="gaming-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-flex flex-column gy-3 w-75 mx-auto">
            <label htmlFor="password" className="gaming-form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="gaming-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="gaming-form-button primary w-75 mx-auto">
            Iniciar Sesión
          </button>
          <Link to="/register" className="gaming-form-button secondary w-75 mx-auto">
            Registrar Usuario
          </Link>
          <Link to="/reset-password" className="gaming-form-link w-75 mx-auto text-center">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  );
}
