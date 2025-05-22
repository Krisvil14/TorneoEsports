import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../commons/Table';
import "../../../../../styles/teams.css";

export default function TeamsAdminInterface() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc'
    });

    const handleCreateTeam = () => {
        navigate('/Regteams');
    };

    const resetFilters = () => {
        setSelectedGame('');
        setSelectedStatus('');
        setSortConfig({ key: 'name', direction: 'asc' });
    };

    const fetchTeams = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/teams');
            const data = await response.json();
            setTeams(data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleToggleStatus = async (teamId, currentStatus) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/teams/${teamId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el estado del equipo');
            }

            // Actualizar la lista de equipos después de cambiar el estado
            await fetchTeams();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cambiar el estado del equipo');
        }
    };

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

        // Aplicar filtro por estado
        if (selectedStatus !== '') {
            const isActive = selectedStatus === 'true';
            filteredTeams = filteredTeams.filter(team => team.is_active === isActive);
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
            header: 'Estado', 
            accessor: 'is_active',
            Cell: ({ value }) => (
                <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
                    {value ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            header: 'Acciones',
            accessor: 'acciones',
            Cell: ({ row }) => (
                <div className="action-buttons">
                    <button
                        className="action-button"
                        onClick={() => navigate(`/admin/teamInfo/${row.id}`)}
                    >
                        Ver Información
                    </button>
                    <button
                        className={`toggle-status-button ${row.is_active ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleStatus(row.id, row.is_active)}
                    >
                        {row.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
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
                        <div className="filter-group">
                            <label htmlFor="statusFilter">Filtrar por Estado:</label>
                            <select
                                id="statusFilter"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="form-control"
                            >
                                <option value="">Todos los estados</option>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
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
