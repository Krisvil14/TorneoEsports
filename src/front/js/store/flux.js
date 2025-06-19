const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ],
            user: null, // Estado del usuario
            isAuthenticated: null, // Estado de autenticación (null = no inicializado, false = no autenticado, true = autenticado)
            inactivityTimer: null, // Timer para inactividad
            inactivityTimeout: 5 * 60 * 1000 // 5 minutos por defecto (en milisegundos)
        },
        actions: {
            // Use getActions to call a function within a function
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try {
                    // fetching data from the backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    // don't forget to return something, that is how the async resolves
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            changeColor: (index, color) => {
                //get the store
                const store = getStore();

                //we have to loop the entire demo array to look for the respective index
                //and change its color
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });

                //reset the global store
                setStore({ demo: demo });
            },

            login: (user) => {
                setStore({ user: user, isAuthenticated: true });
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user.role);
                // NO iniciar el timer de inactividad automáticamente al hacer login
                // El timer se iniciará manualmente cuando sea necesario
            },

            // Nueva función para login con timer (usar cuando sea necesario)
            loginWithTimer: (user) => {
                setStore({ user: user, isAuthenticated: true });
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user.role);
                // Iniciar el timer de inactividad después del login
                getActions().startInactivityTimer();
            },

            logout: () => {
                setStore({ user: null, isAuthenticated: false });
                localStorage.removeItem("user");
                localStorage.removeItem("role");
                // Limpiar el timer de inactividad
                getActions().clearInactivityTimer();
            },

            checkAuth: () => {
                const storedUser = localStorage.getItem("user");
                if (storedUser && storedUser !== "undefined") {
                    try {
                        const user = JSON.parse(storedUser);
                        setStore({ user: user, isAuthenticated: true });
                        // NO iniciar el timer de inactividad automáticamente al recargar
                        // El timer se iniciará manualmente cuando sea necesario
                    } catch (error) {
                        console.error("Error parsing stored user data:", error);
                        localStorage.removeItem("user");
                        setStore({ user: null, isAuthenticated: false });
                    }
                } else {
                    // Si no hay usuario en localStorage, establecer como no autenticado
                    setStore({ user: null, isAuthenticated: false });
                }
            },

            // Función para establecer explícitamente el estado como no autenticado
            setNotAuthenticated: () => {
                setStore({ user: null, isAuthenticated: false });
            },

           updateUser: async (updatedUser) => {
                const store = getStore();
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/users/" + store.user.id, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedUser)
                    });
                    if (resp.ok) {
                        setStore({ user: { ...store.user, ...updatedUser } }); // Actualiza el usuario en el estado global
                    } else {
                        console.error("Error updating user in backend", resp.status);
                    }
                } catch (error) {
                    console.log("Error updating user in backend", error);
                }
            },

            getUser: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/users/" + getStore().user.id);
                    const data = await resp.json();
                    localStorage.setItem("user", JSON.stringify(data)); 
                    setStore({ user: data });
                    
                } catch (error) {
                    console.log("Error loading user from backend", error);
                }
            },

            // Nuevas acciones para manejo de inactividad
            startInactivityTimer: () => {
                const store = getStore();
              
                
                // Limpiar timer existente si hay uno
                if (store.inactivityTimer) {
                  
                    clearTimeout(store.inactivityTimer);
                }
                
                // Crear nuevo timer
                const timer = setTimeout(() => {
                   
                    getActions().logout();
                    // Opcional: mostrar mensaje al usuario
                    alert("Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.");
                }, store.inactivityTimeout);
                
                setStore({ inactivityTimer: timer });
            },

            resetInactivityTimer: () => {
                const store = getStore();
                
                if (store.isAuthenticated) {
                    
                    getActions().startInactivityTimer();
                }
            },

            clearInactivityTimer: () => {
                const store = getStore();
                
                if (store.inactivityTimer) {

                    clearTimeout(store.inactivityTimer);
                    setStore({ inactivityTimer: null });
                }
            },

            setInactivityTimeout: (minutes) => {
                const timeoutMs = minutes * 60 * 1000;
                setStore({ inactivityTimeout: timeoutMs });
                // Reiniciar el timer con el nuevo timeout si el usuario está autenticado
                if (getStore().isAuthenticated) {
                    getActions().startInactivityTimer();
                }
            },

            // Función para iniciar manualmente el timer de inactividad
            startInactivityTimerManually: () => {
                const store = getStore();
                if (store.isAuthenticated && !store.inactivityTimer) {
                    getActions().startInactivityTimer();
                }
            }

    }

    };
};
export default getState;
