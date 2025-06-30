import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../component/commons/Table';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '../store/appContext';
import '../../styles/teamInfoo.css';

export default function TeamInfoUser() {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [hasRequested, setHasRequested] = useState(false);
    const [teamStats, setTeamStats] = useState(null);
    const { store } = React.useContext(Context);

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

        const checkRequestStatus = async () => {
            if (!store.user || !store.user.id) {
                console.log('No user logged in');
                return;
            }

            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/team-requests/check/${teamId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user_id': store.user.id.toString()
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error checking request:', errorData);
                    return;
                }

                const data = await response.json();
                setHasRequested(data.hasRequested);
            } catch (error) {
                console.error('Error checking request status:', error);
            }
        };

        fetchTeam();
        fetchUsers();
        fetchTeamStats();
        checkRequestStatus();
    }, [teamId, store.user]);

    const handleJoinRequest = async () => {
        if (!store.user || !store.user.id) {
            toast.error('Debes iniciar sesión para solicitar unirte a un equipo');
            return;
        }

        if (hasRequested) {
            toast.warning('Ya has solicitado unirte a este equipo');
            return;
        }

        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/team-join-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: store.user.id,
                    team_id: teamId
                })
            });

            if (response.ok) {
                setHasRequested(true);
                toast.success('Solicitud hecha exitosamente');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Error al realizar la solicitud');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error('Error al realizar la solicitud');
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
        Apellido: user.last_name
    }));

    const usersColumns = [
        { header: "Nombre", accessor: "Nombre" },
        { header: "Apellido", accessor: "Apellido" }
    ];

    return (
        <div className="team-info-container">
            <section className="team-info-hero">
                <h1>Información del Equipo</h1>
            </section>
            
            <div className="team-info-content">
                <div className="team-info-buttons">
                    <Link to="/busca-equipo" className="team-info-button">
                        Volver
                    </Link>
                    <button 
                        onClick={handleJoinRequest}
                        className={`team-info-button ${hasRequested ? 'secondary' : ''}`}
                        disabled={hasRequested}
                    >
                        {hasRequested ? 'Solicitud ya enviada' : 'Solicitar unirse al equipo'}
                    </button>
                </div>

                <div className="team-info-section">
                    <h3>Detalles del Equipo</h3>
                    <div className="team-info-table">
                        <Table data={teamData} columns={teamColumns} />
                    </div>
                </div>

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
