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
    const [exchangeRate, setExchangeRate] = useState(0);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!user || !user.team_id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Obtener el saldo del equipo
                const balanceResponse = await fetch(process.env.BACKEND_URL + '/api/team/balance', {
                    method: 'GET',
                    headers: { 'user_id': user.id.toString() }
                });
                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    setTeamBalance(balanceData.balance);
                }

                // Verificar solicitudes existentes
                const checkResponse = await fetch(process.env.BACKEND_URL + `/api/payment-requests/check/${user.team_id}`, {
                    headers: { 'user_id': user.id.toString(), 'action': 'receive_payment' }
                });
                if (checkResponse.ok) {
                    const checkData = await checkResponse.json();
                    setHasRequested(checkData.hasRequested);
                }

                // Obtener tasa de cambio
                const rateResponse = await fetch(process.env.BACKEND_URL + '/api/admin/exchange-rate');
                if (rateResponse.ok) {
                    const rateData = await rateResponse.json();
                    setExchangeRate(rateData.rate);
                }

                // Obtener bancos
                const banksResponse = await fetch(process.env.BACKEND_URL + '/api/banks');
                if (banksResponse.ok) {
                    const banksData = await banksResponse.json();
                    setBanks(banksData);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                toast.error('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
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

        if (hasRequested) {
            toast.warning('Ya tienes una solicitud de pago pendiente');
            return;
        }

        if (!user || !user.team_id) {
            toast.error('Debes pertenecer a un equipo para realizar esta acción');
            return;
        }

        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            toast.error('Por favor ingrese un monto válido en dólares mayor a 0');
            return;
        }

        if (parseFloat(formData.amount) > teamBalance) {
            toast.error(`El monto solicitado no puede exceder el saldo actual del equipo (${teamBalance} USD)`);
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
                amount: parseFloat(formData.amount),
                bank: formData.bank,
                cedula: formData.cedula,
                phone_number: formData.phone_number,
                payment_type: 'outgoing',
                action: 'receive_payment'
            };

            const response = await fetch(process.env.BACKEND_URL + '/api/payment-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

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
                        <label htmlFor="amount" className="gaming-form-label">Monto a Recibir (USD)</label>
                        <input
                            type="number"
                            className="gaming-form-input form-control"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="Ingrese el monto en dólares"
                            required
                            min="1"
                        />
                        {formData.amount && exchangeRate > 0 && (
                            <div className="conversion-display">
                                <p>Monto equivalente en Bs.: {(parseFloat(formData.amount) * exchangeRate).toFixed(2)}</p>
                            </div>
                        )}
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
                            disabled={loading}
                        >
                            <option value="">{loading ? 'Cargando bancos...' : 'Seleccione un banco'}</option>
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.name}>{bank.name}</option>
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
