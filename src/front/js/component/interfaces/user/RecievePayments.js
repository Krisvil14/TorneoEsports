import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../../store/appContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../styles/gaming-form.css';
import { useNavigate } from 'react-router-dom';

export default function RecievePaymentsInterface() {
    const { store, actions } = useContext(Context);
    const user = store.user;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        amount: '',
        bank: '',
        cedula: '',
        phone_number: ''
    });
    const [hasRequested, setHasRequested] = useState(false);
    const [teamBalance, setTeamBalance] = useState(0);

    const banks = [
        'Banco de Venezuela',
        'Mercantil',
        'Banesco',
        'Provincial',
        'BNC',
        'Banco Plaza',
        'Banco Exterior',
        'Bancaribe'
    ];

    useEffect(() => {
        const checkPaymentRequest = async () => {
            if (!user || !user.team_id) return;

            try {
                // Obtener el saldo del equipo
                const balanceResponse = await fetch(process.env.BACKEND_URL + '/api/team/balance', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user_id': user.id.toString()
                    }
                });

                if (!balanceResponse.ok) {
                    throw new Error('Error al obtener el saldo del equipo');
                }

                const balanceData = await balanceResponse.json();
                setTeamBalance(balanceData.balance);

                // Verificar solicitudes existentes
                const response = await fetch(process.env.BACKEND_URL + `/api/payment-requests/check/${user.team_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user_id': user.id.toString(),
                        'action': 'receive_payment'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al verificar solicitudes existentes');
                }

                const data = await response.json();
                setHasRequested(data.hasRequested);
            } catch (error) {
                console.error('Error checking payment request:', error);
                toast.error('Error al verificar solicitudes existentes');
            }
        };

        checkPaymentRequest();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Estado del usuario:', user);

        if (hasRequested) {
            toast.warning('Ya tienes una solicitud de pago pendiente');
            return;
        }

        // Validar que el usuario tenga un equipo
        if (!user || !user.team_id) {
            toast.error('Debes pertenecer a un equipo para realizar esta acción');
            return;
        }

        // Validaciones
        if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
            toast.error('Por favor ingrese un monto válido mayor a 0');
            return;
        }

        // Validar que el monto no exceda el saldo del equipo
        if (parseInt(formData.amount) > teamBalance) {
            toast.error(`El monto solicitado no puede exceder el saldo actual del equipo (${teamBalance})`);
            return;
        }

        if (!formData.bank) {
            toast.error('Por favor seleccione un banco');
            return;
        }
        if (!formData.cedula) {
            toast.error('Por favor ingrese su número de cédula');
            return;
        }
        if (!formData.phone_number) {
            toast.error('Por favor ingrese su número de teléfono');
            return;
        }

        try {
            const requestData = {
                user_id: user.id,
                team_id: user.team_id,
                amount: parseInt(formData.amount),
                bank: formData.bank.toLowerCase().replace(/ /g, '_'),
                cedula: formData.cedula,
                phone_number: formData.phone_number,
                payment_type: 'outgoing',
                action: 'receive_payment'
            };
            console.log('Datos enviados al backend:', requestData);

            const response = await fetch(process.env.BACKEND_URL + '/api/payment-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Respuesta del backend:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud de pago');
            }

            toast.success('Solicitud de pago enviada exitosamente');
            setHasRequested(true);
            setFormData({
                amount: '',
                bank: '',
                cedula: '',
                phone_number: ''
            });
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="gaming-form-container">
            <h1 className="gaming-form-title">Solicitud de Recepción de Pago</h1>
            
            {hasRequested ? (
                 <div>
                 <div className="gaming-alert-info">
                      Ya tienes una solicitud de pago pendiente. Por favor espera a que sea procesada.
                  </div>
                  <div className="volver-container">
                      <button
                          type="button"
                          className="gaming-form-button secondary"
                          onClick={() => navigate('/payments')}
                      >
                          Volver
                      </button>
                  </div>
                  </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="amount" className="gaming-form-label">Monto a Recibir</label>
                        <input
                            type="number"
                            className="gaming-form-input form-control"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Ingrese el monto a recibir"
                            required
                            min="1"
                            max={teamBalance}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bank" className="gaming-form-label">Banco</label>
                        <select
                            className="gaming-form-input form-control"
                            id="bank"
                            name="bank"
                            value={formData.bank}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un banco</option>
                            {banks.map((bank, index) => (
                                <option key={index} value={bank}>{bank}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cedula" className="gaming-form-label">Número de Cédula</label>
                        <input
                            type="text"
                            className="gaming-form-input form-control"
                            id="cedula"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            placeholder="Ingrese su número de cédula"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number" className="gaming-form-label">Número de Teléfono</label>
                        <input
                            type="text"
                            className="gaming-form-input form-control"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Ingrese su número de teléfono"
                            required
                        />
                    </div>

                    <div className="gaming-form-buttons">
                        <button type="submit" className="gaming-form-button primary">
                            Enviar Solicitud
                        </button>
                        <button
                            type="button"
                            className="gaming-form-button secondary"
                            onClick={() => navigate('/payments')}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
