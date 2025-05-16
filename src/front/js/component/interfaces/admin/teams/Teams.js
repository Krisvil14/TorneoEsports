import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../commons/Table';
import "../../../../../styles/teams.css";

export default function TeamsAdminInterface() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc'
    });

    const handleCreateTeam = () => {
        navigate('/Regteams');
    };

    const resetFilters = () => {
        setSelectedGame('');
        setSortConfig({ key: 'name', direction: 'asc' });
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

    // Función para ordenar los equipos
    const sortTeams = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filtrar y ordenar los equipos
    const getFilteredAndSortedTeams = () => {
        let filteredTeams = [...teams];
        
        // Aplicar filtro por juego
        if (selectedGame) {
            filteredTeams = filteredTeams.filter(team => team.game === selectedGame);
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filteredTeams.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredTeams;
    };

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
                <div className="teams-filters">
                    <div className="filters-header">
                        <h2>Filtros y Ordenamiento</h2>
                        <button 
                            className="gaming-button secondary reset-button"
                            onClick={resetFilters}
                        >
                            Reestablecer Filtros
                        </button>
                    </div>
                    <div className="filters-body">
                        <div className="sort-group">
                            <label>Ordenar por:</label>
                            <button
                                onClick={() => sortTeams('name')}
                                className={`sort-button ${sortConfig.key === 'name' ? 'active' : ''}`}
                            >
                                Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                            </button>
                        </div>
                        <div className="filter-group">
                            <label htmlFor="gameFilter">Filtrar por Juego:</label>
                            <select
                                id="gameFilter"
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Todos los juegos</option>
                                <option value="league_of_legends">League of Legends</option>
                                <option value="valorant">Valorant</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="teams-table">
                    <Table columns={columns} data={getFilteredAndSortedTeams()} />
                </div>
            </div>
        </div>
    );
}
