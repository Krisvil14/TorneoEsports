import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditProfilePage() {
    const { store, actions } = useContext(Context);
    const user = store.user;
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState(user?.age || '');

    // Cargar datos actualizados del usuario al montar el componente
    useEffect(() => {
        if (user?.id) {
            actions.getUser();
        }
    }, []);

    // Actualizar los estados cuando cambie el usuario
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');
            setAge(user.age || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            age: age,
            // Solo incluir la contraseña si se ha modificado
            ...(password && { password: password })
        };

        toast.promise(
            fetch(`${process.env.BACKEND_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${store.token}`,
                },
                body: JSON.stringify(updatedData),
            })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'No se pudo actualizar el perfil');
                }
                await actions.getUser();
                return response.json();
            })
            .then(() => {
                navigate('/profile');
            }),
            {
                pending: 'Actualizando perfil...',
                success: 'Perfil actualizado exitosamente',
                error: {
                    render({ data }) {
                        return `${data.message || 'Error desconocido'}`;
                    }
                }
            }
        ).catch(error => {
            console.error(error.message);
        });
    }

    return (
        <div className="container text-center">
            <h1 className="my-4">Editar Perfil</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Apellido:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Dejar en blanco para mantener la contraseña actual"
                    />
                </div>
                <div className="form-group">
                    <label>Edad:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-success mt-3">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-danger mt-3 ms-2"
                    onClick={() => navigate('/profile')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
