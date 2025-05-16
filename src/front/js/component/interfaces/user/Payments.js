import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../store/appContext';
import "../../../../styles/payments.css";

export default function PaymentsInterface() {
    const navigate = useNavigate();
    const { store } = useContext(Context);

    useEffect(() => {
        // Verificar si el usuario es líder o admin
        if (!store.user || (!store.user.is_leader && store.user.role !== 'admin')) {
            navigate('/inicio');
        }
    }, [store.user, navigate]);

    return (
        <div className="payments-container">
            <section className="payments-hero">
                <h1>Gestión de Pagos</h1>
            </section>
            
            <div className="payments-content">
                <div className="button-container">
                    <button 
                        className="gaming-button primary"
                        onClick={() => navigate('/make-payments')}
                    >
                        Realizar Pagos
                    </button>
                    <button 
                        className="gaming-button secondary"
                        onClick={() => navigate('/receive-payments')}
                    >
                        Solicitar Pago
                    </button>
                </div>
            </div>
        </div>
    );
}
