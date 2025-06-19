import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
    const StoreWrapper = props => {
        //this will be passed as the context value
        const [state, setState] = useState(
            getState({
                getStore: () => state.store,
                getActions: () => state.actions,
                setStore: updatedStore =>
                    setState({
                        store: Object.assign(state.store, updatedStore),
                        actions: { ...state.actions }
                    })
            })
        );

        useEffect(() => {
            /**
             * EDIT THIS!
             * This function is the equivalent to "window.onLoad", it only runs once on the entire application lifetime
             * you should do your ajax requests or fetch api requests here. Do not use setState() to save data in the
             * store, instead use actions, like this:
             **/
            state.actions.getMessage(); // <---- calling this function from the flux.js actions
            const storedUser = localStorage.getItem("user");
            
            
            if (storedUser && storedUser !== "undefined") {
                try {
                    const user = JSON.parse(storedUser);
                   
                    // Usar checkAuth en lugar de login para evitar iniciar el timer automáticamente
                    state.actions.checkAuth();
                } catch (error) {
                    console.error("Error parsing stored user data:", error);
                    localStorage.removeItem("user");
                    // No llamar a logout aquí, solo limpiar localStorage
                    // El estado se mantendrá como null hasta que se complete la verificación
                }
            } else {
                
                // Si no hay usuario, establecer como no autenticado después de un breve delay
                // para permitir que el componente Protected muestre loading primero
                setTimeout(() => {
                    
                    state.actions.setNotAuthenticated();
                }, 200);
            }
            // No llamar a logout() si no hay usuario, mantener el estado como null
            // Esto permite que el componente Protected muestre loading mientras se verifica

            // Configurar event listeners para manejo de inactividad y cierre de pestaña
            const setupActivityListeners = () => {
                // Eventos que indican actividad del usuario
                const activityEvents = [
                    'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
                ];

                // Función para reiniciar el timer de inactividad
                const resetTimer = () => {
                    if (state.store.isAuthenticated) {
                        // Si no hay timer activo, iniciarlo manualmente
                        if (!state.store.inactivityTimer) {
                            state.actions.startInactivityTimerManually();
                        } else {
                            // Si ya hay timer, reiniciarlo
                            state.actions.resetInactivityTimer();
                        }
                    }
                };

                // Agregar event listeners para actividad
                activityEvents.forEach(event => {
                    document.addEventListener(event, resetTimer, true);
                });

                // Event listener para cierre de pestaña/navegador
                const handleBeforeUnload = (event) => {
                    // Solo limpiar datos si realmente se está cerrando la pestaña/navegador
                    // No limpiar al recargar la página
                    if (state.store.isAuthenticated) {
                    
                        // Verificar si es una recarga o un cierre real
                        // Si es una recarga, el evento se dispara pero no limpiamos localStorage
                        // Solo limpiamos si realmente se está cerrando la pestaña
                        
                        // Para distinguir entre recarga y cierre, usamos un flag temporal
                        sessionStorage.setItem('isReloading', 'true');
                        
                        // Solo limpiar localStorage si no es una recarga
                        // El flag se eliminará automáticamente al recargar
                    }
                };

                // Event listener para cuando la página se carga (después de recarga)
                const handleLoad = () => {
                  
                    // Si hay flag de recarga, lo eliminamos y no limpiamos localStorage
                    if (sessionStorage.getItem('isReloading')) {
                       
                        sessionStorage.removeItem('isReloading');
                        // No hacer nada, mantener la sesión
                    } else {
                      
                        // Si no hay flag, significa que se cerró la pestaña y se abrió una nueva
                        // En este caso, limpiar localStorage
                        if (state.store.isAuthenticated) {
                            localStorage.removeItem("user");
                            localStorage.removeItem("role");
                        }
                    }
                };

                // Event listener para cuando la pestaña pierde el foco
                const handleVisibilityChange = () => {
                    if (document.hidden && state.store.isAuthenticated) {
                        // Opcional: pausar el timer cuando la pestaña no está visible
                        // state.actions.clearInactivityTimer();
                    } else if (!document.hidden && state.store.isAuthenticated) {
                        // Reiniciar el timer cuando la pestaña vuelve a estar visible
                        state.actions.startInactivityTimer();
                    }
                };

                // Event listener para cuando la ventana pierde el foco
                const handleWindowBlur = () => {
                    // Opcional: puedes agregar lógica adicional aquí
                    // Por ejemplo, mostrar una advertencia de inactividad
                };

                window.addEventListener('beforeunload', handleBeforeUnload);
                window.addEventListener('load', handleLoad);
                document.addEventListener('visibilitychange', handleVisibilityChange);
                window.addEventListener('blur', handleWindowBlur);

                // Cleanup function para remover event listeners
                return () => {
                    activityEvents.forEach(event => {
                        document.removeEventListener(event, resetTimer, true);
                    });
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                    window.removeEventListener('load', handleLoad);
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                    window.removeEventListener('blur', handleWindowBlur);
                };
            };

            // Configurar los event listeners
            const cleanup = setupActivityListeners();

            // Cleanup al desmontar el componente
            return cleanup;
        }, []);

        // The initial value for the context is not null anymore, but the current state of this component,
        // the context will now have a getStore, getActions and setStore functions available, because they were declared
        // on the state of this component
        return (
            <Context.Provider value={state}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;