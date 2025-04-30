import React, { useContext, useEffect } from 'react';
import { Context } from '../../../store/appContext';
import "../../../../styles/profile.css";

export default function ProfileInterface() {
    const { store, actions } = useContext(Context);
    const user = store.user;

    // Función para obtener las iniciales del nombre
    const getInitials = (firstName, lastName) => {
        return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`;
    };

    return (
        <div className="profile-container">
            <section className="profile-hero">
                <div className="profile-avatar">
                    {user ? getInitials(user.first_name, user.last_name) : '??'}
                </div>
                <h1>{user ? `${user.first_name} ${user.last_name}` : 'Cargando...'}</h1>
            </section>

            {user ? (
                <div className="profile-content">
                    <div className="info-grid">
                        <div className="info-card">
                            <strong>Nombre</strong>
                            <p>{user.first_name}</p>
                        </div>
                        <div className="info-card">
                            <strong>Apellido</strong>
                            <p>{user.last_name}</p>
                        </div>
                        <div className="info-card">
                            <strong>Cédula</strong>
                            <p>{user.cedula}</p>
                        </div>
                        <div className="info-card">
                            <strong>Email</strong>
                            <p>{user.email}</p>
                        </div>
                        <div className="info-card">
                            <strong>Edad</strong>
                            <p>{user.age}</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="/editProfile" className="edit-button">
                            Editar Perfil
                        </a>
                    </div>
                </div>
            ) : (
                <div className="profile-content">
                    <p className="text-center">Cargando información del usuario...</p>
                </div>
            )}
        </div>
    );
}
