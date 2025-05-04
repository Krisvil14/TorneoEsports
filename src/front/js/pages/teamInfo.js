import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../component/commons/Table';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/teamInfo.css';

export default function TeamInfo() {
    const { teamId } = useParams();
    const { store, actions } = useContext(Context);
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLeader, setIsLeader] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}`);
                const data = await response.json();
                setTeam(data);
            } catch (error) {
                console.error('Error fetching team:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}/users`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchApplications = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/applications/team/${teamId}`);
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchTeam();
        fetchUsers();
        fetchApplications();
    }, [teamId]);

    useEffect(() => {
        if (store.user && team && users.length > 0) {
            const currentUser = users.find(user => user.id === store.user.id);
            setIsLeader(currentUser?.is_leader || false);

            // Verificar si el usuario actual pertenece al equipo
            if (!currentUser) {
                toast.error('No tienes acceso a este equipo', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/teams');
            }
        }
    }, [store.user, team, users, navigate]);

    const handleApplication = async (applicationId, accepted) => {
        try {
            // Si se intenta aceptar una solicitud y el equipo ya tiene 5 jugadores
            if (accepted && users.length >= 5) {
                toast.error('No se pueden aceptar más jugadores, el equipo ya está completo.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            const response = await fetch(process.env.BACKEND_URL + '/api/handle_application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    application_id: applicationId,
                    accepted: accepted
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al procesar la solicitud');
            }

            // Mostrar toast de éxito
            toast.success(accepted ? 'Solicitud aceptada exitosamente' : 'Solicitud rechazada exitosamente', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Recargar la página después de procesar la solicitud
            window.location.reload();
        } catch (error) {
            console.error('Error handling application:', error);
            toast.error('Error al procesar la solicitud: ' + error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleRemovePlayer = async (userId) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}/remove_player`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    requesting_user_id: store.user?.id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar al jugador');
            }

            toast.success('Jugador eliminado del equipo exitosamente', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Recargar la página para mostrar los cambios
            window.location.reload();
        } catch (error) {
            console.error('Error removing player:', error);
            toast.error('Error al eliminar al jugador: ' + error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    if (!team) {
        return <div className="team-info-container">Loading...</div>;
    }

    const teamData = [
        { "Nombre del Equipo": team.name, "Juego asociado": team.game }
    ];

    const teamColumns = [
        { header: "Nombre del Equipo", accessor: "Nombre del Equipo" },
        { header: "Juego asociado", accessor: "Juego asociado" }
    ];

    const usersData = users.map(user => ({
        Nombre: user.first_name,
        Apellido: user.last_name,
        Cedula: user.cedula,
        Correo: user.email,
        Edad: user.age,
        Acciones: isLeader && user.id !== store.user?.id ? (
            <button 
                className="team-info-button secondary" 
                onClick={() => handleRemovePlayer(user.id)}
            >
                Eliminar
            </button>
        ) : null
    }));

    const usersColumns = [
        { header: "Nombre", accessor: "Nombre" },
        { header: "Apellido", accessor: "Apellido" },
        { header: "Cedula", accessor: "Cedula" },
        { header: "Correo", accessor: "Correo" },
        { header: "Edad", accessor: "Edad" },
        ...(isLeader ? [{ header: "Acciones", accessor: "Acciones" }] : [])
    ];

    const applicationsData = applications
        .filter(app => app.action === 'join_team' && app.status === 'pending' && app.user)
        .map(app => ({
            Usuario: app.user.first_name + ' ' + app.user.last_name,
            Estado: app.user.is_active ? 'Activo' : 'Inactivo',
            'Fecha de Solicitud': new Date(app.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            Acciones: (
                <div className="team-info-buttons">
                    <button 
                        className="team-info-button" 
                        onClick={() => handleApplication(app.id, true)}
                    >
                        Aceptar
                    </button>
                    <button 
                        className="team-info-button secondary" 
                        onClick={() => handleApplication(app.id, false)}
                    >
                        Rechazar
                    </button>
                </div>
            )
        }));

    const applicationsColumns = [
        { header: "Usuario", accessor: "Usuario" },
        { header: "Estado", accessor: "Estado" },
        { header: "Fecha de Solicitud", accessor: "Fecha de Solicitud" },
        { header: "Acciones", accessor: "Acciones" }
    ];

    return (
        <div className="team-info-container">
            <section className="team-info-hero">
                <h1>Información del Equipo</h1>
            </section>
            
            <div className="team-info-content">
                <div className="team-info-buttons">
                    <Link to="/teams" className="team-info-button">
                        Volver
                    </Link>
                </div>

                <div className="team-info-section">
                    <h3>Detalles del Equipo</h3>
                    <div className="team-info-table">
                        <Table data={teamData} columns={teamColumns} />
                    </div>
                </div>

                <div className="team-info-section">
                    <h3>Integrantes</h3>
                    <div className="team-info-table">
                        <Table data={usersData} columns={usersColumns} />
                    </div>
                </div>
                
                {isLeader && (
                    <div className="team-info-section">
                        <h3>Solicitudes</h3>
                        {applicationsData.length > 0 ? (
                            <div className="team-info-table">
                                <Table data={applicationsData} columns={applicationsColumns} />
                            </div>
                        ) : (
                            <p>No hay solicitudes pendientes</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
