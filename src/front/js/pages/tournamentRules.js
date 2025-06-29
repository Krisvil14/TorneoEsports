import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { toast } from 'react-toastify';
import '../../styles/tournaments.css';

export default function TournamentRulesPage() {
    const [tournamentData, setTournamentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const { store } = useContext(Context);
    const user = store.user;

    useEffect(() => {
        const fetchTournamentRules = async () => {
            try {
                const response = await fetch(
                    process.env.BACKEND_URL + `/api/tournament-rules/${tournamentId}`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    setTournamentData(data);
                } else {
                    toast.error('Error al cargar las reglas del torneo');
                    navigate('/tournaments');
                }
            } catch (error) {
                console.error('Error fetching tournament rules:', error);
                toast.error('Error al cargar las reglas del torneo');
                navigate('/tournaments');
            } finally {
                setLoading(false);
            }
        };

        if (tournamentId) {
            fetchTournamentRules();
        }
    }, [tournamentId, navigate]);

    const handleJoinTournament = async () => {
        if (!user || !user.is_in_team) {
            toast.error('Debes estar en un equipo para unirte a un torneo');
            return;
        }

        setJoining(true);
        try {
            const response = await fetch(
                process.env.BACKEND_URL + '/api/team-requests',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        team_id: user.team_id,
                        tournament_id: tournamentId,
                    }),
                }
            );

            if (response.ok) {
                toast.success('Solicitud enviada exitosamente');
                navigate('/tournaments');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Error al enviar la solicitud');
            }
        } catch (error) {
            console.error('Error sending tournament request:', error);
            toast.error('Error al enviar la solicitud');
        } finally {
            setJoining(false);
        }
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

    if (loading) {
        return (
            <div className="tournaments-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando reglas del torneo...</p>
                </div>
            </div>
        );
    }

    if (!tournamentData) {
        return (
            <div className="tournaments-container">
                <div className="error-message">
                    <p>No se pudo cargar la información del torneo</p>
                    <button onClick={() => navigate('/tournaments')} className="back-button">
                        Volver a Torneos
                    </button>
                </div>
            </div>
        );
    }

    const { tournament, standard_rules } = tournamentData;

    return (
        <div className="tournaments-container">
            <section className="tournaments-hero">
                <h1>Reglas del Torneo</h1>
                <button 
                    onClick={() => navigate('/tournaments')} 
                    className="back-button"
                >
                    ← Volver a Torneos
                </button>
            </section>
            
            <div className="tournaments-content">
                <div className="tournament-rules-page">
                    {/* Información del Torneo */}
                    <div className="tournament-info-card">
                        <h2>{tournament.name}</h2>
                        <div className="tournament-details">
                            <div className="detail-row">
                                <span className="detail-label">Juego:</span>
                                <span className="detail-value">{tournament.game}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Fecha de Inicio:</span>
                                <span className="detail-value">{formatDate(tournament.date_start)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Costo de Inscripción:</span>
                                <span className="detail-value">${tournament.cost}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Premio:</span>
                                <span className="detail-value">${tournament.prize}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Formato de Partida:</span>
                                <span className="detail-value">{tournament.match_format}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Formato de Final:</span>
                                <span className="detail-value">{tournament.final_format}</span>
                            </div>
                        </div>
                    </div>

                    {/* Reglas Personalizadas */}
                    {tournament.custom_rules && (
                        <div className="custom-rules-section">
                            <h3>Reglas Adicionales del Torneo</h3>
                            <div className="custom-rules-content">
                                <p>{tournament.custom_rules}</p>
                            </div>
                        </div>
                    )}

                    {/* Reglas Estándar */}
                    <div className="standard-rules-section">
                        <h3>Reglas Estándar</h3>
                        <div className="rules-list">
                            {standard_rules.general_rules.map((rule, index) => (
                                <div key={index} className="rule-item">
                                    <span className="rule-bullet">•</span>
                                    <span className="rule-text">{rule}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="penalties-section">
                            <h4>Sanciones</h4>
                            <p className="warning-text">{standard_rules.warning}</p>
                            <div className="penalties-list">
                                {standard_rules.penalties.map((penalty, index) => (
                                    <div key={index} className="penalty-item">
                                        <span className="penalty-bullet">•</span>
                                        <span className="penalty-text">{penalty}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botón de Unirse */}
                    <div className="join-tournament-section">
                        <div className="join-info">
                            <p>Al hacer clic en "Unirse al Torneo", confirmas que has leído y aceptas todas las reglas establecidas.</p>
                        </div>
                        <div className="join-buttons">
                            <button 
                                onClick={() => navigate('/tournaments')} 
                                className="cancel-button"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleJoinTournament}
                                disabled={joining || !user || !user.is_in_team}
                                className="join-button"
                            >
                                {joining ? 'Enviando Solicitud...' : 'Unirse al Torneo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 