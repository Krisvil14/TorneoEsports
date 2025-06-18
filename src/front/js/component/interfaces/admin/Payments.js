import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../../store/appContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../styles/gaming-form.css';
import Table from '../../commons/Table';

export default function AdminPaymentsInterface() {
    const { store, actions } = useContext(Context);
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [isEditingRate, setIsEditingRate] = useState(false);
    const [newRate, setNewRate] = useState('');

    useEffect(() => {
        fetchPaymentRequests();
        fetchExchangeRate();
    }, []);

    const fetchPaymentRequests = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/admin/payment-requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las solicitudes de pago');
            }

            const data = await response.json();
            setPaymentRequests(data);
        } catch (error) {
            console.error('Error fetching payment requests:', error);
            toast.error('Error al obtener las solicitudes de pago');
        }
    };

    const fetchExchangeRate = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/admin/exchange-rate', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener la tasa de cambio');
            }

            const data = await response.json();
            setExchangeRate(data.rate);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            toast.error('Error al obtener la tasa de cambio');
        }
    };

    const handleUpdateExchangeRate = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/admin/exchange-rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rate: parseFloat(newRate)
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la tasa de cambio');
            }

            toast.success('Tasa de cambio actualizada exitosamente');
            setExchangeRate(parseFloat(newRate));
            setIsEditingRate(false);
            setNewRate('');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleApprove = async (applicationId) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/handle_application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    application_id: applicationId,
                    accepted: true
                })
            });

            if (!response.ok) {
                throw new Error('Error al aprobar la solicitud');
            }

            toast.success('Solicitud aprobada exitosamente');
            fetchPaymentRequests();
            setShowDetails(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleReject = async (applicationId) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/handle_application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    application_id: applicationId,
                    accepted: false
                })
            });

            if (!response.ok) {
                throw new Error('Error al rechazar la solicitud');
            }

            toast.success('Solicitud rechazada exitosamente');
            fetchPaymentRequests();
            setShowDetails(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetails(true);
    };

    const columns = [
        { header: 'Usuario', accessor: 'user_name' },
        { header: 'Equipo', accessor: 'team_name' },
        { 
            header: 'Tipo', 
            accessor: 'action',
            Cell: ({ value }) => value === 'do_payment' ? 'Pago entrante' : 'Solicitud de Pago'
        },
        { 
            header: 'Fecha', 
            accessor: 'created_at',
            Cell: ({ value }) => new Date(value).toLocaleDateString()
        },
        {
            header: 'Acciones',
            accessor: 'id',
            Cell: ({ row }) => (
                <button
                    className="gaming-form-button"
                    onClick={() => handleViewDetails(row)}
                >
                    Ver Detalles
                </button>
            )
        }
    ];

    return (
        <div className="gaming-form-container">
            <h1 className="gaming-form-title">Gestión de Solicitudes de Pago</h1>
            
            <div className="exchange-rate-section">
                <h2>Tasa de Cambio Actual</h2>
                {isEditingRate ? (
                    <div className="rate-edit-form">
                        <input
                            type="number"
                            step="0.01"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                            placeholder="Nueva tasa"
                            className="gaming-form-input"
                        />
                        <button
                            className="gaming-form-button"
                            onClick={handleUpdateExchangeRate}
                        >
                            Guardar
                        </button>
                        <button
                            className="gaming-form-button secondary"
                            onClick={() => {
                                setIsEditingRate(false);
                                setNewRate('');
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="rate-display">
                        <p>1 USD = {exchangeRate} Bs.</p>
                        <button
                            className="gaming-form-button"
                            onClick={() => setIsEditingRate(true)}
                        >
                            Editar Tasa
                        </button>
                    </div>
                )}
            </div>

            {showDetails && selectedRequest ? (
                <div className="payment-details">
                    <h2>Detalles de la Solicitud</h2>
                    <div className="details-content">
                        <p><strong>Usuario:</strong> {selectedRequest.user_name}</p>
                        <p><strong>Equipo:</strong> {selectedRequest.team_name}</p>
                        <p><strong>Tipo de Solicitud:</strong> {selectedRequest.action === 'do_payment' ? 'Pago entrante' : 'Solicitud de Pago'}</p>
                        <p><strong>Fecha:</strong> {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                        
                        {selectedRequest.payment_details && (
                            <>
                                <h3>Detalles del Pago</h3>
                                <p><strong>Monto en USD:</strong> ${selectedRequest.payment_details.amount}</p>
                                <p><strong>Monto en Bs.:</strong> Bs.{(selectedRequest.payment_details.amount * exchangeRate).toFixed(2)}</p>
                                <p><strong>Banco:</strong> {selectedRequest.payment_details.bank}</p>
                                <p><strong>Referencia:</strong> {selectedRequest.payment_details.reference}</p>
                                <p><strong>Cédula:</strong> {selectedRequest.payment_details.cedula}</p>
                                <p><strong>Teléfono:</strong> {selectedRequest.payment_details.phone_number}</p>
                            </>
                        )}
                        
                        <div className="action-buttons">
                            <button
                                className="gaming-form-button"
                                onClick={() => handleApprove(selectedRequest.id)}
                            >
                                Aprobar
                            </button>
                            <button
                                className="gaming-form-button secondary"
                                onClick={() => handleReject(selectedRequest.id)}
                            >
                                Rechazar
                            </button>
                            <button
                                className="gaming-form-button"
                                onClick={() => setShowDetails(false)}
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="payment-requests-table">
                    {paymentRequests.length === 0 ? (
                        <div className="no-requests-message">
                            <h3>No hay solicitudes de pago pendientes</h3>
                        </div>
                    ) : (
                        <Table columns={columns} data={paymentRequests} />
                    )}
                </div>
            )}
        </div>
    );
}
