import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../store/appContext';
import "../../../../styles/profile.css";

export default function ProfileInterface() {
    const { store, actions } = useContext(Context);
    const user = store.user;
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (user) {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/${user.id}/stats`);
                    const data = await response.json();
                    setStats(data);
                } catch (error) {
                    console.error('Error fetching user stats:', error);
                }
            }
        };

        fetchUserStats();
    }, [user]);

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

                    {/* Sección de Estadísticas */}
                    <div className="stats-section">
                        <h2 className="stats-title">Estadísticas del Jugador</h2>
                        <div className="stats-grid">
                            <div className="stat-card kills">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-info">
                                    <h3>Kills</h3>
                                    <p>{stats?.kills || 0}</p>
                                </div>
                            </div>
                            <div className="stat-card assists">
                                <div className="stat-icon">🤝</div>
                                <div className="stat-info">
                                    <h3>Asistencias</h3>
                                    <p>{stats?.assists || 0}</p>
                                </div>
                            </div>
                            <div className="stat-card deaths">
                                <div className="stat-icon">💀</div>
                                <div className="stat-info">
                                    <h3>Muertes</h3>
                                    <p>{stats?.deaths || 0}</p>
                                </div>
                            </div>
                            <div className="stat-card kda">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <h3>KDA</h3>
                                    <p>{stats?.kda ? stats.kda.toFixed(2) : '0.00'}</p>
                                </div>
                            </div>
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
