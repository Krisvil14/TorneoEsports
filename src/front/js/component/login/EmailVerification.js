import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../styles/gaming-form.css';

export default function EmailVerification() {
  const [otp, setOtp] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minutos en segundos
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Obtener el user_id de la URL o del estado de la navegación
    const params = new URLSearchParams(location.search);
    const id = params.get('user_id') || location.state?.user_id;
    if (id) {
      setUserId(id);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  React.useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Solo permite números y máximo 6 dígitos
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('El código debe tener 6 dígitos');
      return;
    }

    if (timeLeft <= 0) {
      toast.error('El código ha expirado. Por favor, solicita uno nuevo.');
      return;
    }

    const notification = toast.loading('Verificando código...');

    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          otp_code: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.update(notification, {
          render: 'Email verificado exitosamente',
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
      toast.update(notification, {
        render: 'Error al verificar el código',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const handleResendCode = async () => {
    const notification = toast.loading('Reenviando código...');

    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(600); // Reiniciar el contador
        toast.update(notification, {
          render: 'Código reenviado exitosamente',
          type: 'success',
          autoClose: 5000,
          isLoading: false,
        });
      } else {
        toast.update(notification, {
          render: data.error,
          type: 'error',
          autoClose: 5000,
          isLoading: false,
        });
      }
    } catch (err) {
      toast.update(notification, {
        render: 'Error al reenviar el código',
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
          <h1 className="w-75 mx-auto fs-1 gaming-form-title">Verificación de Email</h1>
        </div>
        <div className="row gy-3">
          <div className="d-flex flex-column gy-3 w-75 mx-auto">
            <label htmlFor="otp" className="gaming-form-label">
              Ingresa el código de verificación enviado a tu email:
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              className="form-control gaming-form-input"
              placeholder="Código de 6 dígitos"
              maxLength="6"
              required
            />
            <div className="text-center mt-2">
              <small className="gaming-form-title">
                Tiempo restante: {formatTime(timeLeft)}
              </small>
            </div>
          </div>
          <button 
            type="submit" 
            className="gaming-form-button primary w-75 mx-auto"
            disabled={timeLeft <= 0}
          >
            Verificar Email
          </button>
          <button
            type="button"
            onClick={handleResendCode}
            className="gaming-form-button secondary w-75 mx-auto"
          >
            Reenviar Código
          </button>
        </div>
      </form>
    </div>
  );
} 