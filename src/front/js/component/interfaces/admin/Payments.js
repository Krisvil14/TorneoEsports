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

    useEffect(() => {
        fetchPaymentRequests();
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
            Cell: ({ value }) => value === 'do_payment' ? 'Solicitud de Pago' : 'Pago Entrante'
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
            
            {showDetails && selectedRequest ? (
                <div className="payment-details">
                    <h2>Detalles de la Solicitud</h2>
                    <div className="details-content">
                        <p><strong>Usuario:</strong> {selectedRequest.user_name}</p>
                        <p><strong>Equipo:</strong> {selectedRequest.team_name}</p>
                        <p><strong>Tipo de Solicitud:</strong> {selectedRequest.action === 'do_payment' ? 'Solicitud de Pago' : 'Pago Entrante'}</p>
                        <p><strong>Fecha:</strong> {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                        
                        {selectedRequest.payment_details && (
                            <>
                                <h3>Detalles del Pago</h3>
                                <p><strong>Monto:</strong> Bs.{selectedRequest.payment_details.amount}</p>
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
                    <Table columns={columns} data={paymentRequests} />
                </div>
            )}
        </div>
    );
}
