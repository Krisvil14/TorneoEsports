import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../../component/commons/Table';
import { Link } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/teamInfoo.css';

export default function TeamInfo() {
    const { teamId } = useParams();
    const { store, actions } = useContext(Context);
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLeader, setIsLeader] = useState(false);
    const [teamStats, setTeamStats] = useState(null);
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

        const fetchTeamStats = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}/stats`);
                const data = await response.json();
                setTeamStats(data);
            } catch (error) {
                console.error('Error fetching team stats:', error);
            }
        };

        fetchTeam();
        fetchUsers();
        fetchTeamStats();
    }, [teamId]);

    useEffect(() => {
        if (store.user && team && users.length > 0) {
            const currentUser = users.find(user => user.id === store.user.id);
            setIsLeader(currentUser?.is_leader || false);

            // Verificar si el usuario actual pertenece al equipo o es admin
            if (!currentUser && store.user.role !== 'admin') {
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
        Acciones: (isLeader || store.user.role === 'admin') && user.id !== store.user?.id ? (
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
        ...(isLeader || store.user.role === 'admin' ? [{ header: "Acciones", accessor: "Acciones" }] : [])
    ];

    return (
        <div className="team-info-container">
            <section className="team-info-hero">
                <h1>Información del Equipo</h1>
            </section>
            
            <div className="team-info-content">
                <div className="team-info-buttons">
                    <Link to="/admin/teams" className="team-info-button">
                        Volver
                    </Link>
                </div>

                <div className="team-info-section">
                    <h3>Detalles del Equipo</h3>
                    <div className="team-info-table">
                        <Table data={teamData} columns={teamColumns} />
                    </div>
                </div>

                {/* Sección de Estadísticas del Equipo para Admin */}
                <div className="team-info-section">
                    <h3>Estadísticas del Equipo</h3>
                    <div className="team-stats-grid">
                        <div className="team-stat-card games">
                            <div className="team-stat-icon">🎮</div>
                            <div className="team-stat-info">
                                <h4>Partidos Jugados</h4>
                                <p>{teamStats?.games_count || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card wins">
                            <div className="team-stat-icon">🏆</div>
                            <div className="team-stat-info">
                                <h4>Victorias</h4>
                                <p>{teamStats?.games_win || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card losses">
                            <div className="team-stat-icon">💔</div>
                            <div className="team-stat-info">
                                <h4>Derrotas</h4>
                                <p>{teamStats?.games_lose || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card tournaments-played">
                            <div className="team-stat-icon">🏅</div>
                            <div className="team-stat-info">
                                <h4>Torneos Jugados</h4>
                                <p>{teamStats?.tournament_count || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card tournaments-won">
                            <div className="team-stat-icon">🥇</div>
                            <div className="team-stat-info">
                                <h4>Torneos Ganados</h4>
                                <p>{teamStats?.tournament_win || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card tournaments-lost">
                            <div className="team-stat-icon">🥈</div>
                            <div className="team-stat-info">
                                <h4>Torneos Perdidos</h4>
                                <p>{teamStats?.tournament_loses || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card kills">
                            <div className="team-stat-icon">🎯</div>
                            <div className="team-stat-info">
                                <h4>Kills Totales</h4>
                                <p>{teamStats?.total_kills || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card assists">
                            <div className="team-stat-icon">🤝</div>
                            <div className="team-stat-info">
                                <h4>Asistencias Totales</h4>
                                <p>{teamStats?.total_assists || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card deaths">
                            <div className="team-stat-icon">💀</div>
                            <div className="team-stat-info">
                                <h4>Muertes Totales</h4>
                                <p>{teamStats?.total_deaths || 0}</p>
                            </div>
                        </div>
                        <div className="team-stat-card kda">
                            <div className="team-stat-icon">📊</div>
                            <div className="team-stat-info">
                                <h4>KDA del Equipo</h4>
                                <p>{teamStats?.team_kda ? teamStats.team_kda.toFixed(2) : '0.00'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="team-info-section">
                    <h3>Integrantes</h3>
                    <div className="team-info-table">
                        <Table data={usersData} columns={usersColumns} />
                    </div>
                </div>
                
            </div>
        </div>
    );
}
