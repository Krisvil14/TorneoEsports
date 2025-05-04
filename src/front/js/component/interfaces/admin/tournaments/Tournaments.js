import React, { useState, useEffect } from 'react';
import Table from '../../../commons/Table';
import { useNavigate } from 'react-router-dom';
import "../../../../../styles/tournaments.css";

export default function TournamentsAdminInterface() {
    const [tournaments, setTournaments] = useState([]);
    const navigate = useNavigate();

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

        fetchTournaments();
    }, []);

    const handleCreateTournament = () => {
        navigate('/admin/create_tournament');
    };

    const columns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Fecha de Inicio', accessor: 'date_start' },
        { header: 'Juego', accessor: 'game' },
        { 
            header: 'Cantidad de Equipos', 
            accessor: 'num_teams',
            Cell: ({ row }) => `${row.num_teams}/${row.num_max_teams}`
        },
        {
            header: 'Acciones',
            accessor: 'id',
            Cell: ({ value }) => (
                <div className="action-buttons">
                    <button
                        className="action-button"
                        onClick={() => navigate(`/admin/addteam/${value}`)}
                    >
                        Añadir Equipo
                    </button>
                    <button
                        className="action-button"
                        onClick={() => navigate(`/admin/tournament-requests/${value}`)}
                    >
                        Ver Solicitudes
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="tournaments-container">
            <section className="tournaments-hero">
                <h1>Gestión de Torneos</h1>
            </section>
            
            <div className="tournaments-content">
                <div className="button-container">
                    <button 
                        className="create-team-button"
                        onClick={handleCreateTournament}
                    >
                        Crear Torneo
                    </button>
                </div>
                
                <div className="tournaments-table">
                    <Table columns={columns} data={tournaments} />
                </div>
            </div>
        </div>
    );
}
