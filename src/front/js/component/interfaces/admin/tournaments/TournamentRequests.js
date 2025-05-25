import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../../../commons/Table';
import TournamentBrackets from '../../../commons/TournamentBrackets';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../../styles/tournaments.css';

function MatchEditModal({ match, onClose, onSave }) {
  const [score1, setScore1] = useState(match.score1 ?? 0);
  const [score2, setScore2] = useState(match.score2 ?? 0);
  const [team1Stats, setTeam1Stats] = useState([]);
  const [team2Stats, setTeam2Stats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      setError(null);
      try {
        const [res1, res2] = await Promise.all([
          fetch(process.env.BACKEND_URL + `/api/teams/${match.team1_id}/users`),
          fetch(process.env.BACKEND_URL + `/api/teams/${match.team2_id}/users`),
        ]);
        const [players1, players2] = await Promise.all([
          res1.json(),
          res2.json(),
        ]);
        setTeam1Stats(
          players1.map((p) => ({ ...p, kills: 0, assists: 0, deaths: 0 }))
        );
        setTeam2Stats(
          players2.map((p) => ({ ...p, kills: 0, assists: 0, deaths: 0 }))
        );
      } catch (e) {
        setError('Error al cargar jugadores');
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, [match.team1_id, match.team2_id]);

  const handleStatChange = (team, idx, stat, value) => {
    const update = (arr) =>
      arr.map((p, i) => (i === idx ? { ...p, [stat]: value } : p));
    if (team === 1) setTeam1Stats(update(team1Stats));
    else setTeam2Stats(update(team2Stats));
  };

  const handleSave = () => {
    onSave({
      matchId: match.id,
      score1,
      score2,
      team1Stats,
      team2Stats,
      isFinal: match.is_final,
    });
  };

  return (
    <div className="custom-modal-overlay">
      <div
        className="custom-modal-content"
        style={{ minWidth: 400, maxWidth: 700 }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          style={{
            float: 'right',
            fontSize: 24,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        <h2 style={{ color: '#00e6e6', marginTop: 0 }}>Editar Partido</h2>
        <div className="modal-section">
          <div className="modal-team-name">
            {match.team1 ? match.team1.name : 'TBD'}
          </div>
          <div className="modal-score-input">
            <label>Score:</label>
            <input
              type="number"
              value={score1}
              min={0}
              onChange={(e) => setScore1(Number(e.target.value))}
            />
          </div>
          <div className="modal-players-list">
            {loading
              ? 'Cargando jugadores...'
              : error
              ? error
              : team1Stats.map((p, idx) => (
                  <div key={p.id} className="modal-player-row">
                    <span>
                      {p.first_name} {p.last_name}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={p.kills}
                      onChange={(e) =>
                        handleStatChange(
                          1,
                          idx,
                          'kills',
                          Number(e.target.value)
                        )
                      }
                      placeholder="Kills"
                    />
                    <input
                      type="number"
                      min={0}
                      value={p.assists}
                      onChange={(e) =>
                        handleStatChange(
                          1,
                          idx,
                          'assists',
                          Number(e.target.value)
                        )
                      }
                      placeholder="Assists"
                    />
                    <input
                      type="number"
                      min={0}
                      value={p.deaths}
                      onChange={(e) =>
                        handleStatChange(
                          1,
                          idx,
                          'deaths',
                          Number(e.target.value)
                        )
                      }
                      placeholder="Deaths"
                    />
                  </div>
                ))}
          </div>
        </div>
        <div className="modal-section">
          <div className="modal-team-name">
            {match.team2 ? match.team2.name : 'TBD'}
          </div>
          <div className="modal-score-input">
            <label>Score:</label>
            <input
              type="number"
              value={score2}
              min={0}
              onChange={(e) => setScore2(Number(e.target.value))}
            />
          </div>
          <div className="modal-players-list">
            {loading
              ? 'Cargando jugadores...'
              : error
              ? error
              : team2Stats.map((p, idx) => (
                  <div key={p.id} className="modal-player-row">
                    <span>
                      {p.first_name} {p.last_name}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={p.kills}
                      onChange={(e) =>
                        handleStatChange(
                          2,
                          idx,
                          'kills',
                          Number(e.target.value)
                        )
                      }
                      placeholder="Kills"
                    />
                    <input
                      type="number"
                      min={0}
                      value={p.assists}
                      onChange={(e) =>
                        handleStatChange(
                          2,
                          idx,
                          'assists',
                          Number(e.target.value)
                        )
                      }
                      placeholder="Assists"
                    />
                    <input
                      type="number"
                      min={0}
                      value={p.deaths}
                      onChange={(e) =>
                        handleStatChange(
                          2,
                          idx,
                          'deaths',
                          Number(e.target.value)
                        )
                      }
                      placeholder="Deaths"
                    />
                  </div>
                ))}
          </div>
        </div>
        <div
          className="custom-modal-buttons"
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}
        >
          <button onClick={onClose} style={{ marginRight: 10 }}>
            Cancelar
          </button>
          <button className="primary" onClick={handleSave}>
            {match.is_final ? 'Finalizar Torneo' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TournamentRequests() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [refreshBrackets, setRefreshBrackets] = useState(false);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        // Obtener información del torneo
        const tournamentResponse = await fetch(
          process.env.BACKEND_URL + `/api/tournaments/${tournamentId}`
        );
        const tournamentData = await tournamentResponse.json();
        setTournament(tournamentData);

        // Obtener equipos del torneo
        const teamsResponse = await fetch(
          process.env.BACKEND_URL + `/api/tournaments/${tournamentId}/teams`
        );
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);

        // Obtener solicitudes pendientes
        const applicationsResponse = await fetch(
          process.env.BACKEND_URL +
            `/api/tournaments/${tournamentId}/applications`
        );
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        toast.error('Error al cargar la información del torneo');
      }
    };

    fetchTournamentData();
  }, [tournamentId]);

  const handleApplication = async (applicationId, accepted) => {
    try {
      const response = await fetch(
        process.env.BACKEND_URL + '/api/handle_application',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            application_id: applicationId,
            accepted: accepted,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar la solicitud');
      }

      toast.success(
        accepted
          ? 'Solicitud aceptada exitosamente'
          : 'Solicitud rechazada exitosamente'
      );
      window.location.reload();
    } catch (error) {
      console.error('Error handling application:', error);
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  const handleMatchClick = (match, setRefresh) => {
    setSelectedMatch({ match, setRefresh });
  };

  const handleModalClose = () => {
    setSelectedMatch(null);
  };

  const handleModalSave = async ({
    matchId,
    score1,
    score2,
    team1Stats,
    team2Stats,
  }) => {
    await fetch(
      process.env.BACKEND_URL + `/api/matches/${matchId}/update-score`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score1, score2, registered: true }),
      }
    );
    setSelectedMatch(null);
    if (selectedMatch && selectedMatch.setRefresh)
      selectedMatch.setRefresh((r) => !r);
  };

  if (!tournament) {
    return <div className="tournaments-container">Loading...</div>;
  }

  const teamsColumns = [
    { header: 'Nombre del Equipo', accessor: 'name' },
    { header: 'Juego', accessor: 'game' },
    { header: 'Jugadores', accessor: 'current_players' },
  ];

  const applicationsColumns = [
    { header: 'Equipo Solicitante', accessor: 'team_name' },
    { header: 'Fecha de Solicitud', accessor: 'created_at' },
    {
      header: 'Acciones',
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="action-buttons">
          <button
            className="action-button"
            onClick={() => handleApplication(row.id, true)}
          >
            Aceptar
          </button>
          <button
            className="action-button secondary"
            onClick={() => handleApplication(row.id, false)}
          >
            Rechazar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="tournaments-container">
      <section className="tournaments-hero">
        <h1>Solicitudes del Torneo: {tournament.name}</h1>
      </section>
      <div className="tournaments-content">
        {tournament.started && (
          <div className="tournaments-section">
            <h2 className="text-center">Brackets del Torneo</h2>
            <TournamentBrackets
              tournamentId={tournamentId}
              onMatchClick={handleMatchClick}
            />
            {selectedMatch && (
              <MatchEditModal
                match={selectedMatch.match}
                onClose={handleModalClose}
                onSave={handleModalSave}
              />
            )}
          </div>
        )}
        <div className="tournaments-section">
          <h2>Equipos Participantes</h2>
          <div className="tournaments-table">
            <Table columns={teamsColumns} data={teams} />
          </div>
        </div>

        <div className="tournaments-section">
          <h2>Solicitudes Pendientes</h2>
          {applications.length > 0 ? (
            <div className="tournaments-table">
              <Table columns={applicationsColumns} data={applications} />
            </div>
          ) : (
            <p>No hay solicitudes pendientes</p>
          )}
        </div>

        <div className="button-container">
          <button
            className="action-button"
            onClick={() => navigate('/admin/tournaments')}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
