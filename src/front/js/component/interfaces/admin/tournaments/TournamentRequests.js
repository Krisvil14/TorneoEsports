import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../../../commons/Table';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../../../styles/tournaments.css";

export default function TournamentRequests() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchTournamentData = async () => {
            try {
                // Obtener información del torneo
                const tournamentResponse = await fetch(process.env.BACKEND_URL + `/api/tournaments/${tournamentId}`);
                const tournamentData = await tournamentResponse.json();
                setTournament(tournamentData);

                // Obtener equipos del torneo
                const teamsResponse = await fetch(process.env.BACKEND_URL + `/api/tournaments/${tournamentId}/teams`);
                const teamsData = await teamsResponse.json();
                setTeams(teamsData);

                // Obtener solicitudes pendientes
                const applicationsResponse = await fetch(process.env.BACKEND_URL + `/api/tournaments/${tournamentId}/applications`);
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
            const response = await fetch(process.env.BACKEND_URL + '/api/handle_application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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

            toast.success(accepted ? 'Solicitud aceptada exitosamente' : 'Solicitud rechazada exitosamente');
            window.location.reload();
        } catch (error) {
            console.error('Error handling application:', error);
            toast.error('Error al procesar la solicitud: ' + error.message);
        }
    };

    if (!tournament) {
        return <div className="tournaments-container">Loading...</div>;
    }

    const teamsColumns = [
        { header: 'Nombre del Equipo', accessor: 'name' },
        { header: 'Juego', accessor: 'game' },
        { header: 'Jugadores', accessor: 'current_players' }
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
            )
        }
    ];

    return (
        <div className="tournaments-container">
            <section className="tournaments-hero">
                <h1>Solicitudes del Torneo: {tournament.name}</h1>
            </section>
            
            <div className="tournaments-content">
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