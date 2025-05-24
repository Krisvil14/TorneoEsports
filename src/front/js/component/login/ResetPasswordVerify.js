import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../styles/gaming-form.css';

const ResetPasswordVerify = () => {
  const [otpCode, setOtpCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isVerified, setIsVerified] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.user_id;

  React.useEffect(() => {
    if (!user_id) {
      navigate('/reset-password');
    }
  }, [user_id, navigate]);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Solo permite números y máximo 6 dígitos
    if (/^\d{0,6}$/.test(value)) {
      setOtpCode(value);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otpCode) {
      toast.error('Por favor ingresa el código de verificación');
      return;
    }

    if (otpCode.length !== 6) {
      toast.error('El código debe tener 6 dígitos');
      return;
    }

    const notification = toast.loading('Verificando código...');

    try {
      const requestData = {
        user_id: user_id,
        otp_code: otpCode.trim()
      };

      console.log('Enviando verificación con:', requestData);

      const response = await fetch(process.env.BACKEND_URL + '/api/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (response.ok) {
        toast.update(notification, {
          render: 'Código verificado exitosamente',
          type: 'success',
          autoClose: 5000,
          isLoading: false,
        });
        setIsVerified(true);
      } else {
        toast.update(notification, {
          render: data.error || 'Error al verificar el código',
          type: 'error',
          autoClose: 5000,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error('Error en la verificación:', err);
      toast.update(notification, {
        render: 'Error al verificar el código',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const notification = toast.loading('Actualizando contraseña...');

    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          new_password: newPassword,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.update(notification, {
          render: 'Contraseña actualizada exitosamente',
          type: 'success',
          autoClose: 5000,
          isLoading: false,
        });
        navigate('/login');
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
        render: 'Error al actualizar la contraseña',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  return (
    <div className="gaming-form-container">
      <form onSubmit={isVerified ? handleResetPassword : handleVerifyOTP}>
        <div className="row mb-4 text-center">
          <h1 className="w-75 mx-auto fs-1 gaming-form-title">
            {isVerified ? 'Establecer Nueva Contraseña' : 'Verificar Código'}
          </h1>
        </div>
        <div className="row gy-3">
          {!isVerified ? (
            <div className="d-flex flex-column gy-3 w-75 mx-auto">
              <label htmlFor="otp" className="gaming-form-label">Código de Verificación:</label>
              <input
                onChange={handleOtpChange}
                value={otpCode}
                className="form-control gaming-form-input"
                type="text"
                id="otp"
                name="otp"
                placeholder="Ingresa el código de 6 dígitos"
                maxLength="6"
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            </div>
          ) : (
            <>
              <div className="d-flex flex-column gy-3 w-75 mx-auto">
                <label htmlFor="new_password" className="gaming-form-label">Nueva Contraseña:</label>
                <input
                  onChange={({ target }) => setNewPassword(target.value)}
                  value={newPassword}
                  className="form-control gaming-form-input"
                  type="password"
                  id="new_password"
                  name="new_password"
                  required
                />
              </div>
              <div className="d-flex flex-column gy-3 w-75 mx-auto">
                <label htmlFor="confirm_password" className="gaming-form-label">Confirmar Contraseña:</label>
                <input
                  onChange={({ target }) => setConfirmPassword(target.value)}
                  value={confirmPassword}
                  className="form-control gaming-form-input"
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  required
                />
              </div>
            </>
          )}
          <button type="submit" className="gaming-form-button primary w-75 mx-auto">
            {isVerified ? 'Actualizar Contraseña' : 'Verificar Código'}
          </button>
          <Link to="/login" className="gaming-form-button secondary w-75 mx-auto">
            Volver al Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordVerify; 