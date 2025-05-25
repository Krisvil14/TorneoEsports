import React, { useEffect, useState } from 'react';
import '../../../styles/tournament-brackets.css';

function groupMatchesByDepth(matches) {
  const rounds = {};
  matches.forEach((match) => {
    if (!rounds[match.depth]) rounds[match.depth] = [];
    rounds[match.depth].push(match);
  });
  // Ordenar por profundidad ascendente (menor profundidad a la izquierda)
  return Object.keys(rounds)
    .sort((a, b) => Number(a) - Number(b))
    .map((depth) => rounds[depth]);
}

export default function TournamentBrackets({ tournamentId, onMatchClick }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(
          process.env.BACKEND_URL + `/api/tournaments/${tournamentId}/matches`
        );
        const data = await res.json();
        if (res.ok) {
          setMatches(data);
        } else {
          setError(data.error || 'Error al cargar los brackets');
        }
      } catch (e) {
        setError('Error de red');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [tournamentId, refresh]);

  useEffect(() => {
    // Detectar ganador si existe score en la final
    if (matches.length > 0) {
      const rounds = groupMatchesByDepth(matches);
      const finalRound = rounds[rounds.length - 1];
      if (finalRound && finalRound.length === 1) {
        const finalMatch = finalRound[0];
        if (finalMatch.score1 !== null && finalMatch.score2 !== null) {
          if (finalMatch.score1 > finalMatch.score2 && finalMatch.team1) {
            setWinner(finalMatch.team1.name);
          } else if (
            finalMatch.score2 > finalMatch.score1 &&
            finalMatch.team2
          ) {
            setWinner(finalMatch.team2.name);
          } else {
            setWinner(null);
          }
        } else {
          setWinner(null);
        }
      } else {
        setWinner(null);
      }
    } else {
      setWinner(null);
    }
  }, [matches]);

  if (loading) return <div>Cargando brackets...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!matches.length) return <div>No hay partidos aún.</div>;

  const rounds = groupMatchesByDepth(matches);
  const currentDepth = rounds.length - 1;
  const currentRound = rounds[currentDepth];
  const allRegistered = currentRound.every((match) => match.registered);

  const handleAdvanceRound = async () => {
    setAdvancing(true);
    try {
      await fetch(
        process.env.BACKEND_URL +
          `/api/tournaments/${tournamentId}/advance-round`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_depth: currentDepth }),
        }
      );
      setRefresh((r) => !r);
    } catch (e) {
      alert('Error al avanzar la ronda');
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <div className="bracket-simple-wrapper">
      {rounds.map((round, rIdx) => (
        <div className="bracket-simple-round" key={rIdx}>
          <div className="bracket-simple-title">
            {rIdx === rounds.length - 1 ? 'Ronda Final' : `Ronda ${rIdx + 1}`}
          </div>
          {round.map((match, mIdx) => {
            // Agregar la clase connect-vertical a los partidos intermedios (no primero ni último)
            let matchClass = 'bracket-simple-match d-flex flex-column';
            if (
              rIdx < rounds.length - 1 &&
              round.length > 2 &&
              mIdx !== 0 &&
              mIdx !== round.length - 1
            ) {
              matchClass += ' connect-vertical';
            }
            return (
              <button
                className={matchClass}
                key={match.id}
                onClick={
                  onMatchClick
                    ? () => onMatchClick(match, setRefresh)
                    : undefined
                }
              >
                <span className="bracket-team bracket-team-left">
                  {match.team1 ? match.team1.name : 'TBD'}
                </span>
                <div className="w-100 bracket-button-separator">
                  <span className="bracket-button-separator__span">vs</span>
                </div>
                <span className="bracket-team bracket-team-right">
                  {match.team2 ? match.team2.name : 'TBD'}
                </span>
              </button>
            );
          })}
        </div>
      ))}
      {/* Columna extra para el ganador */}
      {winner && (
        <div className="bracket-simple-round">
          <div className="bracket-simple-title">Ganador</div>
          <button
            className="advance-round-btn"
            style={{
              background: '#ffd600',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '1.1em',
              cursor: 'default',
              marginTop: 20,
            }}
            disabled
          >
            {winner}
          </button>
        </div>
      )}
      {allRegistered && onMatchClick && (
        <div className="advance-round-container">
          <button
            className="advance-round-btn"
            onClick={handleAdvanceRound}
            disabled={advancing}
          >
            {advancing ? 'Avanzando...' : 'Actualizar Brackets (Avanzar Ronda)'}
          </button>
        </div>
      )}
    </div>
  );
}
