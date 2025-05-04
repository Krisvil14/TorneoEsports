import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../commons/Table';
import "../../../../../styles/teams.css";

export default function TeamsAdminInterface() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);

    const handleCreateTeam = () => {
        navigate('/Regteams');
    };

    useEffect(() => {
        // Obtener los datos de los equipos desde el backend
        const fetchTeams = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + '/api/teams');
                const data = await response.json();
                setTeams(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    const columns = [
        { header: 'Nombre del Equipo', accessor: 'name' },
        { header: 'Juego', accessor: 'game' },
        {
            header: 'Ver Información',
            accessor: 'verInformacion',
            Cell: ({ row }) => (
                <button
                    className="action-button"
                    onClick={() => navigate(`/admin/teamInfo/${row.id}`)}
                >
                    Ver Información
                </button>
            ),
        },
    ];

    return (
        <div className="teams-container">
            <section className="teams-hero">
                <h1>Gestión de Equipos</h1>
            </section>
            
            <div className="teams-content">
                
                
                <div className="teams-table">
                    <Table columns={columns} data={teams} />
                </div>
            </div>
        </div>
    );
}
