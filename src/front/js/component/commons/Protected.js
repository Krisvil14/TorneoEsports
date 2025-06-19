import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext.js';
import LoadingSpinner from './LoadingSpinner.js';

export default function Protected({ children, requiredRole }) {
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const [isChecking, setIsChecking] = useState(true);
    
    // Usar el estado del contexto global en lugar de localStorage directo
    const user = store.user;
    const role = user ? user.role : null;

    useEffect(() => {
        // Esperar un poco para que el contexto se inicialice completamente
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 300); // Aumentar el tiempo para debugging

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Solo verificar después de que se haya completado la verificación inicial
        if (!isChecking) {

            // Solo redirigir si estamos completamente seguros de que no hay sesión
            if (store.isAuthenticated === false && user === null) {
                
                navigate('/login');
            } else if (store.isAuthenticated && requiredRole && role !== requiredRole) {
                
                navigate('/inicio');
            } else if (store.isAuthenticated === true && user) {
                
            }
        }
    }, [store.isAuthenticated, user, requiredRole, navigate, role, isChecking]);

    // Mostrar loading mientras se verifica la autenticación
    if (isChecking || store.isAuthenticated === null) {
        
        return <LoadingSpinner />;
    }

    
    return (
        <>
            {children}
        </>
    );
}
