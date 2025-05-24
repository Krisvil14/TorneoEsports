import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../styles/gaming-form.css';

const ResetPasswordRequest = () => {
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);

    const notification = toast.loading('Enviando código de verificación...');

    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/recovery', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        toast.update(notification, {
          render: 'Se ha enviado un código de verificación a tu correo',
          type: 'success',
          autoClose: 5000,
          isLoading: false,
        });
        navigate('/verify-reset-otp', { state: { user_id: data.user_id } });
      } else {
        toast.update(notification, {
          render: data.error,
          type: 'error',
          autoClose: 5000,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log(err);
      toast.update(notification, {
        render: 'Error al procesar la solicitud',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  return (
    <div className="gaming-form-container">
      <form onSubmit={handleSubmit}>
        <div className="row mb-4 text-center">
          <h1 className="w-75 mx-auto fs-1 gaming-form-title">Restablecer Contraseña</h1>
        </div>
        <div className="row gy-3">
          <div className="d-flex flex-column gy-3 w-75 mx-auto">
            <label htmlFor="email" className="gaming-form-label">Correo Electrónico:</label>
            <input
              onChange={({ target }) => setEmail(target.value)}
              value={email}
              className="form-control gaming-form-input"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <button type="submit" className="gaming-form-button primary w-75 mx-auto">
            Enviar Código de Verificación
          </button>
          <Link to="/login" className="gaming-form-button secondary w-75 mx-auto">
            Volver al Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordRequest; 