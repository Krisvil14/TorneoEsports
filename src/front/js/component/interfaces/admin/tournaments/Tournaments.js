import React, { useState, useEffect } from 'react';
import Table from '../../../commons/Table';
import { useNavigate } from 'react-router-dom';
import "../../../../../styles/tournaments.css";

export default function TournamentsAdminInterface() {
    const [tournaments, setTournaments] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc'
    });
    const [filters, setFilters] = useState({
        name: '',
        game: ''
    });
    const navigate = useNavigate();

    const resetFilters = () => {
        setFilters({
            name: '',
            game: ''
        });
        setSortConfig({
            key: 'name',
            direction: 'asc'
        });
    };

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

    // Función para ordenar torneos
    const sortTournaments = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Función para obtener torneos filtrados y ordenados
    const getFilteredAndSortedTournaments = () => {
        let filteredTournaments = [...tournaments];

        // Aplicar filtro por nombre
        if (filters.name) {
            const searchTerm = filters.name.toLowerCase();
            filteredTournaments = filteredTournaments.filter(tournament => 
                tournament.name.toLowerCase().includes(searchTerm)
            );
        }

        // Aplicar filtro por juego
        if (filters.game) {
            filteredTournaments = filteredTournaments.filter(tournament => 
                tournament.game === filters.game
            );
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filteredTournaments.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredTournaments;
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
                        Información y Solicitudes
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
            
            <div className="button-container">
                    <button 
                        className="create-team-button"
                        onClick={handleCreateTournament}
                    >
                        Crear Torneo
                    </button>
                </div>

            <div className="tournaments-content">
                

                <div className="tournaments-filters">
                    <div className="filters-header">
                        <h2>Filtros y Ordenamiento</h2>
                        <button 
                            className="gaming-button secondary reset-button"
                            onClick={resetFilters}
                        >
                            Reestablecer Filtros
                        </button>
                    </div>
                    <div className="sort-group">
                        <label>Ordenar por:</label>
                        <button
                            onClick={() => sortTournaments('name')}
                            className={`sort-button ${sortConfig.key === 'name' ? 'active' : ''}`}
                        >
                            Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                        </button>
                        <button
                            onClick={() => sortTournaments('date_start')}
                            className={`sort-button ${sortConfig.key === 'date_start' ? 'active' : ''}`}
                        >
                            Fecha {sortConfig.key === 'date_start' && (sortConfig.direction === 'asc' ? '(↑)' : '(↓)')}
                        </button>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="tournamentName">Filtrar por Torneo:</label>
                        <select
                            id="tournamentName"
                            value={filters.name}
                            onChange={(e) => setFilters({...filters, name: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos los torneos</option>
                            {[...new Set(tournaments.map(t => t.name))].map((name, idx) => (
                                <option key={idx} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="gameFilter">Filtrar por Juego:</label>
                        <select
                            id="gameFilter"
                            value={filters.game}
                            onChange={(e) => setFilters({...filters, game: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos los juegos</option>
                            <option value="league_of_legends">League of Legends</option>
                            <option value="valorant">Valorant</option>
                        </select>
                    </div>
                </div>
                
                <div className="tournaments-table">
                    <Table columns={columns} data={getFilteredAndSortedTournaments()} />
                </div>
            </div>
        </div>
    );
}
