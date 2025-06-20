import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../component/commons/Table';
import TournamentBrackets from '../component/commons/TournamentBrackets';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/teamInfoo.css'

export default function TeamInfo() {
    const { teamId } = useParams();
    const { store, actions } = useContext(Context);
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLeader, setIsLeader] = useState(false);
    const [teamStats, setTeamStats] = useState(null);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showNewLeaderModal, setShowNewLeaderModal] = useState(false);
    const [selectedNewLeader, setSelectedNewLeader] = useState(null);
    const [teamTournaments, setTeamTournaments] = useState([]);
    const [showBracketModal, setShowBracketModal] = useState(false);
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
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

        const fetchTeamStats = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}/stats`);
                const data = await response.json();
                setTeamStats(data);
            } catch (error) {
                console.error('Error fetching team stats:', error);
            }
        };

        const fetchTeamTournaments = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}/tournaments`);
                const data = await response.json();
                setTeamTournaments(data);
            } catch (error) {
                console.error('Error fetching team tournaments:', error);
            }
        };

        fetchTeam();
        fetchUsers();
        fetchApplications();
        fetchTeamStats();
        fetchTeamTournaments();
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

    useEffect(() => {
        if (showLeaveModal || showNewLeaderModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [showLeaveModal, showNewLeaderModal]);

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
            // Verificar si el equipo está en un torneo activo
            if (team && team.tournament_id) {
                toast.error('No se pueden eliminar jugadores mientras el equipo está participando en un torneo activo', {
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

    const handleLeaveTeam = async () => {
        try {
            // Verificar si el equipo está en un torneo activo
            if (team && team.tournament_id) {
                toast.error('No puedes salir del equipo mientras está participando en un torneo activo', {
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

            const teamMembers = users.filter(user => user.id !== store.user.id);
            
            if (teamMembers.length > 0) {
                setShowNewLeaderModal(true);
            } else {
                setShowLeaveModal(true);
            }
        } catch (error) {
            console.error('Error al preparar la salida del equipo:', error);
            toast.error('Error al preparar la salida del equipo');
        }
    };

    const confirmLeaveTeam = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/teams/leave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: store.user.id,
                    new_leader_id: selectedNewLeader
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                if (data.team_disabled) {
                    toast.warning('El equipo ha sido desactivado por no tener más miembros');
                }
                navigate('/teams');
            } else {
                toast.error(data.error || 'Error al salir del equipo');
            }
        } catch (error) {
            console.error('Error al salir del equipo:', error);
            toast.error('Error al salir del equipo');
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
        Acciones:
            // Si es el usuario logueado y es líder, mostrar botón de salir
            (user.id === store.user?.id && user.is_leader) ? (
                <button 
                    className={`team-info-button danger ${team && team.tournament_id ? 'disabled' : ''}`}
                    onClick={handleLeaveTeam}
                    disabled={team && team.tournament_id}
                    title={team && team.tournament_id ? 'No puedes salir del equipo mientras está en un torneo activo' : ''}
                >
                    Salir del Equipo
                </button>
            ) :
            // Si el usuario logueado es líder o admin y la fila es otro miembro, mostrar eliminar
            ((isLeader || store.user.role === 'admin') && user.id !== store.user?.id) ? (
                <button 
                    className={`team-info-button secondary ${team && team.tournament_id ? 'disabled' : ''}`}
                    onClick={() => handleRemovePlayer(user.id)}
                    disabled={team && team.tournament_id}
                    title={team && team.tournament_id ? 'No se pueden eliminar jugadores mientras el equipo está en un torneo activo' : ''}
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

    // Tabla de torneos jugados
    const tournamentsColumns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Juego', accessor: 'game' },
        { header: 'Fecha de Inicio', accessor: 'date_start' },
        { header: 'Estado', accessor: 'started', Cell: ({ row }) => row.finished ? 'Finalizado' : 'En curso' },
        {
            header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => (
                <button className="team-info-button" onClick={() => { setSelectedTournamentId(row.id); setShowBracketModal(true); }}>
                    Ver Bracket
                </button>
            )
        }
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

                {showLeaveModal && (
                    <div className="custom-modal-overlay">
                        <div className="custom-modal-content">
                            <h3>Confirmar Salida</h3>
                            <p>¿Estás seguro de que deseas salir del equipo? Al ser el último miembro, el equipo será desactivado.</p>
                            <div className="custom-modal-buttons">
                                <button onClick={() => setShowLeaveModal(false)}>Cancelar</button>
                                <button onClick={confirmLeaveTeam} className="danger">Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="team-info-section">
                    <h3>Detalles del Equipo</h3>
                    <div className="team-info-table">
                        <Table data={teamData} columns={teamColumns} />
                    </div>
                </div>

                {/* Mostrar información si el equipo está en un torneo activo */}
                {team && team.tournament_id && (
                    <div className="team-info-section tournament-warning">
                        <div className="tournament-warning-content">
                            <div className="tournament-warning-icon">🏆</div>
                            <div className="tournament-warning-text">
                                <h4>Equipo en Torneo Activo</h4>
                                <p>Este equipo está actualmente participando en un torneo. No se pueden realizar cambios en la composición del equipo hasta que el torneo finalice.</p>
                            </div>
                        </div>
                    </div>
                )}

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
                
                {(isLeader || store.user.role === 'admin') && (
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

                <div className="team-info-section">
                    <h3>Torneos Jugados</h3>
                    <div className="team-info-table">
                        <Table columns={tournamentsColumns} data={teamTournaments} />
                    </div>
                </div>

                {showBracketModal && (
                    <div className="custom-modal-overlay">
                        <div className="custom-modal-content" style={{ minWidth: 400, maxWidth: 900, position: 'relative' }}>
                            <button
                                className="modal-close"
                                onClick={() => setShowBracketModal(false)}
                                style={{
                                    position: 'absolute',
                                    color: 'black',
                                    top: 10,
                                    right: 20,
                                    fontSize: 28,
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                            <h2 style={{ color: '#00e6e6', marginTop: 0 }}>Bracket del Torneo</h2>
                            <TournamentBrackets tournamentId={selectedTournamentId} />
                        </div>
                    </div>
                )}

                {/* Modal para seleccionar nuevo líder */}
                {showNewLeaderModal && (
                    <div className="custom-modal-overlay">
                        <div className="custom-modal-content">
                            <h3>Seleccionar Nuevo Líder</h3>
                            <p>Debes seleccionar un nuevo líder antes de salir del equipo.</p>
                            <select 
                                value={selectedNewLeader || ''} 
                                onChange={(e) => setSelectedNewLeader(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Selecciona un nuevo líder</option>
                                {users
                                    .filter(user => user.id !== store.user.id)
                                    .map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name}
                                        </option>
                                    ))
                                }
                            </select>
                            <div className="custom-modal-buttons">
                                <button onClick={() => setShowNewLeaderModal(false)}>Cancelar</button>
                                <button 
                                    onClick={confirmLeaveTeam} 
                                    className="primary"
                                    disabled={!selectedNewLeader}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
