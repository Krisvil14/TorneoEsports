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
            isAuthenticated: false // Estado de autenticación
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
            },

            
            logout: () => {
                setStore({ user: null, isAuthenticated: false });
                localStorage.removeItem("user");
                localStorage.removeItem("role");
            },

            checkAuth: () => {
                const storedUser = localStorage.getItem("user");
                if (storedUser && storedUser !== "undefined") {
                    try {
                        const user = JSON.parse(storedUser);
                        setStore({ user: user, isAuthenticated: true });
                    } catch (error) {
                        console.error("Error parsing stored user data:", error);
                        localStorage.removeItem("user");
                    }
                } else {
                    setStore({ user: null, isAuthenticated: false });
                }
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
                    setStore({ user: data });
                } catch (error) {
                    console.log("Error loading user from backend", error);
                }
            },

    }

    };
};
export default getState;
