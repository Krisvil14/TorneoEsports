import React, { useState, useEffect, useContext } from 'react';
import Table from '../../commons/Table';
import TournamentBrackets from '../../commons/TournamentBrackets';
import { Context } from '../../../store/appContext';
import { useNavigate } from 'react-router-dom';
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
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  const [teamMaxPlayers, setTeamMaxPlayers] = useState(5);
  const [tournamentRules, setTournamentRules] = useState(null);
  const { store } = useContext(Context);
  const user = store.user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(
          process.env.BACKEND_URL + '/api/tournaments'
        );
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
          const teamResponse = await fetch(
            process.env.BACKEND_URL + `/api/teams/${user.team_id}`
          );
          const teamData = await teamResponse.json();
          setTeamGame(teamData.game);
          setTeamId(teamData.id);
          setTeamBalance(teamData.balance || 0);
          setTeamMaxPlayers(teamData.max_players || 5);

          // Obtener información de los miembros del equipo
          const membersResponse = await fetch(
            process.env.BACKEND_URL + `/api/teams/${user.team_id}/users`
          );
          const membersData = await membersResponse.json();
          setTeamMembersCount(membersData.length);

          // Verificar si el usuario es líder
          const currentUserInTeam = membersData.find(
            (member) => member.id === user.id
          );
          setIsTeamLeader(currentUserInTeam?.is_leader || false);

          // Si el equipo está en un torneo, obtener la información del torneo
          if (teamData.tournament_id) {
            try {
              const tournamentResponse = await fetch(
                process.env.BACKEND_URL +
                  `/api/tournaments/${teamData.tournament_id}`
              );
              if (tournamentResponse.ok) {
                const tournamentData = await tournamentResponse.json();
                setTeamTournament(tournamentData);
                
                // Cargar las reglas del torneo
                const rulesResponse = await fetch(
                  process.env.BACKEND_URL + `/api/tournament-rules/${teamData.tournament_id}`
                );
                if (rulesResponse.ok) {
                  const rulesData = await rulesResponse.json();
                  setTournamentRules(rulesData);
                }
              } else {
                console.error(
                  'Error fetching tournament:',
                  tournamentResponse.status
                );
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

  const handleViewRules = (tournamentId) => {
    navigate(`/tournament-rules/${tournamentId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { 
        header: 'Fecha de Inicio', 
        accessor: 'date_start',
        Cell: ({ value }) => {
            if (!value) return '';
            try {
                const datePart = value.split('T')[0];
                const [year, month, day] = datePart.split('-');
                return `${day}/${month}/${year}`;
            } catch (e) {
                return value;
            }
        }
    },
    { header: 'Juego', accessor: 'game' },
    { header: 'Costo ($)', accessor: 'cost' },
    {header: 'Premio ($)', accessor: 'prize'},
    {
      header: 'Cantidad de Equipos',
      accessor: 'num_teams',
      Cell: ({ row }) => {
        const currentTeams = row.num_teams || 0;
        const maxTeams = row.num_max_teams || 0;
        return `${currentTeams}/${maxTeams}`;
      },
    },
    {
      header: 'Acciones',
      accessor: 'actions',
      Cell: ({ row }) => {
        if (isTeamLeader && !teamTournament) {
          const hasEnoughBalance = teamBalance >= row.cost;
          const isTeamComplete = teamMembersCount >= teamMaxPlayers;
          const canJoin = hasEnoughBalance && isTeamComplete;
          
          let tooltipMessage = '';
          if (!hasEnoughBalance) {
            tooltipMessage = 'Saldo insuficiente para unirse al torneo';
          } else if (!isTeamComplete) {
            tooltipMessage = `Tu equipo debe estar completo (${teamMembersCount}/${teamMaxPlayers} jugadores)`;
          }
          
          return (
            <button
              onClick={() => handleViewRules(row.id)}
              className={`join-tournament-button ${!canJoin ? 'disabled' : ''}`}
              disabled={!canJoin}
              title={tooltipMessage}
            >
              Ver Reglas y Unirse
            </button>
          );
        }
        return null;
      },
    },
  ];

  // Filtrar torneos por el juego del equipo y que no estén finalizados
  const filteredTournaments = tournaments.filter(
    (tournament) => tournament.game === teamGame && tournament.finished !== true && tournament.started !== true
  );

  // Componente para mostrar las reglas del torneo actual
  const TournamentRulesDisplay = ({ tournament, rules }) => {
    if (!tournament || !rules) return null;

    const { standard_rules } = rules;

    return (
      <div className="tournament-rules-display">
        <h3>Reglas del Torneo</h3>
        
        <div className="tournament-info">
          <h4>Información del Torneo</h4>
          <p><strong>Formato de Partida:</strong> {tournament.match_format}</p>
          <p><strong>Formato de Final:</strong> {tournament.final_format}</p>
          {tournament.custom_rules && (
            <div className="custom-rules">
              <h5>Reglas Adicionales:</h5>
              <p>{tournament.custom_rules}</p>
            </div>
          )}
        </div>

        <div className="standard-rules">
          <h4>Reglas Estándar</h4>
          <ul>
            {standard_rules.general_rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
          
          <div className="penalties-section">
            <p><strong>{standard_rules.warning}</strong></p>
            <ul>
              {standard_rules.penalties.map((penalty, index) => (
                <li key={index}>• {penalty}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

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
          <p className="tournaments-message">
            ¡Aquí se verá la información de tus torneos!
          </p>
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
          
          {/* Mostrar las reglas del torneo */}
          <TournamentRulesDisplay tournament={tournamentRules?.tournament} rules={tournamentRules} />
          
          {teamTournament.started && (
            <div className="tournament-brackets-container">
              <h2 className="text-center">Brackets del Torneo</h2>
              <TournamentBrackets tournamentId={teamTournament.id} />
            </div>
          )}
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
          {filteredTournaments.length > 0 ? (
            <div className="tournaments-table">
              <Table columns={columns} data={filteredTournaments} />
            </div>
          ) : (
            <p className="tournaments-message">
              No hay torneos activos asociados a tu juego ({teamGame})
            </p>
          )}
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
        <p className="tournaments-message">
          ¡Aquí se verá la información de tus torneos!
        </p>
      </div>
    </div>
  );
}
