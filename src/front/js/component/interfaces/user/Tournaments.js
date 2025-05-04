import React, { useState, useEffect, useContext } from 'react';
import Table from '../../commons/Table';
import { Context } from '../../../store/appContext';
import '../../../../styles/tournaments.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TournamentsInterface() {
    const [tournaments, setTournaments] = useState([]);
    const [teamTournament, setTeamTournament] = useState(null);
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [teamGame, setTeamGame] = useState(null);
    const [teamId, setTeamId] = useState(null);
    const [teamBalance, setTeamBalance] = useState(0);
    const { store } = useContext(Context);
    const user = store.user;

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + '/api/tournaments');
                const data = await response.json();
                setTournaments(data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        const fetchTeamInfo = async () => {
            if (user && user.is_in_team) {
                try {
                    // Obtener información del equipo
                    const teamResponse = await fetch(process.env.BACKEND_URL + `/api/teams/${user.team_id}`);
                    const teamData = await teamResponse.json();
                    setTeamGame(teamData.game);
                    setTeamId(teamData.id);
                    setTeamBalance(teamData.balance || 0);
                    
                    // Obtener información de los miembros del equipo
                    const membersResponse = await fetch(process.env.BACKEND_URL + `/api/teams/${user.team_id}/users`);
                    const membersData = await membersResponse.json();
                    
                    // Verificar si el usuario es líder
                    const currentUserInTeam = membersData.find(member => member.id === user.id);
                    setIsTeamLeader(currentUserInTeam?.is_leader || false);

                    // Si el equipo está en un torneo, obtener la información del torneo
                    if (teamData.tournament_id) {
                        try {
                            const tournamentResponse = await fetch(process.env.BACKEND_URL + `/api/tournaments/${teamData.tournament_id}`);
                            if (tournamentResponse.ok) {
                                const tournamentData = await tournamentResponse.json();
                                setTeamTournament(tournamentData);
                            } else {
                                console.error('Error fetching tournament:', tournamentResponse.status);
                            }
                        } catch (error) {
                            console.error('Error fetching tournament:', error);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching team information:', error);
                }
            }
        };

        fetchTournaments();
        fetchTeamInfo();
    }, [user]);

    const handleJoinTournament = async (tournamentId) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/tournament-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    team_id: teamId,
                    tournament_id: tournamentId
                })
            });

            if (response.ok) {
                toast.success('Solicitud enviada exitosamente');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Error al enviar la solicitud');
            }
        } catch (error) {
            console.error('Error sending tournament request:', error);
            toast.error('Error al enviar la solicitud');
        }
    };

    const columns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Fecha de Inicio', accessor: 'date_start' },
        { header: 'Juego', accessor: 'game' },
        { header: 'Costo ($)', accessor: 'cost' },
        { 
            header: 'Cantidad de Equipos', 
            accessor: 'num_teams',
            Cell: ({ row }) => {
                const currentTeams = row.num_teams || 0;
                const maxTeams = row.num_max_teams || 0;
                return `${currentTeams}/${maxTeams}`;
            }
        },
        {
            header: 'Acciones',
            accessor: 'actions',
            Cell: ({ row }) => {
                if (isTeamLeader && !teamTournament) {
                    const canJoin = teamBalance >= row.cost;
                    return (
                        <button 
                            onClick={() => handleJoinTournament(row.id)}
                            className={`join-tournament-button ${!canJoin ? 'disabled' : ''}`}
                            disabled={!canJoin}
                            title={!canJoin ? 'Saldo insuficiente para unirse al torneo' : ''}
                        >
                            Solicitar Unirse
                        </button>
                    );
                }
                return null;
            }
        }
    ];

    // Filtrar torneos por el juego del equipo
    const filteredTournaments = tournaments.filter(tournament => tournament.game === teamGame);

    if (!user) {
        return <div className="tournaments-container">Loading...</div>;
    }

    if (!user.is_in_team) {
        return (
            <div className="tournaments-container">
                <section className="tournaments-hero">
                    <h1>Gestión de Torneos</h1>
                </section>
                <div className="tournaments-content">
                    <p className="tournaments-message">¡Aquí se verá la información de tus torneos!</p>
                </div>
            </div>
        );
    }

    // Si el equipo está en un torneo, mostrar la información del torneo a todos los miembros
    if (teamTournament) {
        return (
            <div className="tournaments-container">
                <section className="tournaments-hero">
                    <h1>Información del Torneo</h1>
                </section>
                <div className="tournaments-content">
                    <div className="tournaments-table">
                        <Table columns={columns} data={[teamTournament]} />
                    </div>
                </div>
            </div>
        );
    }

    // Si el equipo no está en un torneo y el usuario es líder, mostrar la lista de torneos filtrados
    if (isTeamLeader) {
        return (
            <div className="tournaments-container">
                <section className="tournaments-hero">
                    <h1>Gestión de Torneos</h1>
                 
                </section>
                <div className="tournaments-content">
                    <div className="tournaments-table">
                        <Table columns={columns} data={filteredTournaments} />
                    </div>
                </div>
            </div>
        );
    }

    // Si el equipo no está en un torneo y el usuario no es líder
    return (
        <div className="tournaments-container">
            <section className="tournaments-hero">
                <h1>Gestión de Torneos</h1>
            </section>
            <div className="tournaments-content">
                <p className="tournaments-message">¡Aquí se verá la información de tus torneos!</p>
            </div>
        </div>
    );
}
