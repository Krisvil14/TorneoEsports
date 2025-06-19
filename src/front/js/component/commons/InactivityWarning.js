import React, { useState, useEffect, useContext, useRef } from 'react';
import { Context } from '../../store/appContext.js';

const InactivityWarning = () => {
    const { store, actions } = useContext(Context);
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(60);
    
    // Usar useRef para mantener referencias a los timers
    const warningTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const inactivityWarningTimerRef = useRef(null);

    useEffect(() => {
        // Limpiar timers existentes al cambiar el estado de autenticación
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        if (inactivityWarningTimerRef.current) clearTimeout(inactivityWarningTimerRef.current);
        
        setShowWarning(false);
        setCountdown(60);

        // Solo configurar si el usuario está autenticado
        if (store.isAuthenticated) {
            // Configurar el timer de advertencia (1 minuto antes del timeout de inactividad)
            const warningTimeout = store.inactivityTimeout - (1 * 60 * 1000); // 1 minuto antes
            
            inactivityWarningTimerRef.current = setTimeout(() => {
                console.log("InactivityWarning: Mostrando advertencia");
                setShowWarning(true);
                setCountdown(60);
                
                // Timer para cerrar sesión después de la advertencia
                warningTimerRef.current = setTimeout(() => {
                    console.log("InactivityWarning: Cerrando sesión por inactividad");
                    actions.logout();
                    setShowWarning(false);
                    alert("Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.");
                }, 60000); // 60 segundos

                // Timer para el countdown
                countdownTimerRef.current = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownTimerRef.current);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }, warningTimeout);
        }

        // Cleanup function
        return () => {
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
            if (inactivityWarningTimerRef.current) clearTimeout(inactivityWarningTimerRef.current);
        };
    }, [store.isAuthenticated, store.inactivityTimeout, actions]);

    // Función para ocultar la advertencia y reiniciar el timer
    const hideWarning = () => {
        console.log("InactivityWarning: Ocultando advertencia, reiniciando timer");
        setShowWarning(false);
        setCountdown(60);
        
        // Limpiar timers de advertencia
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current);
            warningTimerRef.current = null;
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        
        // Reiniciar el timer de inactividad principal
        actions.resetInactivityTimer();
    };

    // Event listeners para actividad del usuario (solo cuando la advertencia está visible)
    useEffect(() => {
        if (!showWarning) return;

        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const handleActivity = (event) => {
            console.log("InactivityWarning: Actividad detectada durante advertencia");
            hideWarning();
        };

        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        return () => {
            activityEvents.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
        };
    }, [showWarning]);

    if (!showWarning) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '10px',
                textAlign: 'center',
                maxWidth: '400px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>
                    ⚠️ Advertencia de Inactividad
                </h3>
                <p style={{ marginBottom: '1rem' }}>
                    Tu sesión expirará en <strong>{countdown} segundos</strong> por inactividad.
                </p>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                    Mueve el mouse o presiona una tecla para mantener tu sesión activa.
                </p>
                <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${(countdown / 60) * 100}%`,
                        height: '100%',
                        backgroundColor: countdown > 30 ? '#f39c12' : '#e74c3c',
                        transition: 'width 1s linear'
                    }}></div>
                </div>
                <button 
                    onClick={hideWarning}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                    }}
                >
                    Mantener Sesión
                </button>
                <button 
                    onClick={() => {
                        console.log("InactivityWarning: Botón de prueba clickeado");
                        hideWarning();
                    }}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Probar Extensión
                </button>
            </div>
        </div>
    );
};

export default InactivityWarning; 