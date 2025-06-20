import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from '../../../commons/Table';
import "../../../../../styles/teams.css";

export default function TeamsAdminInterface() {
    const [teams, setTeams] = useState([]);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        name: '',
        game: '',
        is_active: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const navigate = useNavigate();

    const resetFilters = () => {
        setFilters({
            name: '',
            game: '',
            is_active: ''
        });
        setSortConfig({ key: '', direction: 'asc' });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar equipos
                const teamsResponse = await fetch(process.env.BACKEND_URL + '/api/admin/teams');
                if (teamsResponse.ok) {
                    const teamsData = await teamsResponse.json();
                    setTeams(teamsData);
                }

                // Cargar juegos
                const gamesResponse = await fetch(process.env.BACKEND_URL + '/api/games');
                if (gamesResponse.ok) {
                    const gamesData = await gamesResponse.json();
                    setGames(gamesData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateTeam = () => {
        navigate('/admin/create-team');
    };

    const handleToggleStatus = async (teamId, currentStatus) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/teams/${teamId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();
                
                // Actualizar el estado local del equipo
                setTeams(prevTeams => 
                    prevTeams.map(team => 
                        team.id === teamId 
                            ? { ...team, is_active: !team.is_active }
                            : team
                    )
                );

                toast.success(result.message);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Error al cambiar el estado del equipo');
            }
        } catch (error) {
            console.error('Error toggling team status:', error);
            toast.error('Error al cambiar el estado del equipo');
        }
    };

    const sortTeams = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Función para obtener equipos filtrados y ordenados
    const getFilteredAndSortedTeams = () => {
        let filteredTeams = [...teams];

        // Aplicar filtro por nombre
        if (filters.name) {
            const searchTerm = filters.name.toLowerCase();
            filteredTeams = filteredTeams.filter(team => 
                team.name.toLowerCase().includes(searchTerm)
            );
        }

        // Aplicar filtro por juego
        if (filters.game) {
            filteredTeams = filteredTeams.filter(team => 
                team.game === filters.game
            );
        }

        // Aplicar filtro por estado activo
        if (filters.is_active !== '') {
            const activeValue = filters.is_active === 'true';
            filteredTeams = filteredTeams.filter(team => 
                team.is_active === activeValue
            );
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filteredTeams.sort((a, b) => {
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

        return filteredTeams;
    };

    const columns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Juego', accessor: 'game' },
        { 
            header: 'Jugadores', 
            accessor: 'current_players',
            Cell: ({ row }) => `${row.current_players}/${row.max_players}`
        },
        
        {
            header: 'Estado',
            accessor: 'is_active',
            Cell: ({ value, row }) => (
                <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
                    {value ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            header: 'Acciones',
            accessor: 'id',
            Cell: ({ value, row }) => (
                <div className="action-buttons">
                    <button
                        className="action-button"
                        onClick={() => navigate(`/admin/teamInfo/${value}`)}
                    >
                        Ver Detalles
                    </button>
                    <button
                        className={`toggle-status-button ${row.is_active ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleStatus(value, row.is_active)}
                    >
                        {row.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="teams-container">
            <section className="teams-hero">
                <h1>Gestión de Equipos</h1>
            </section>
            
            <div className="button-container">
                <button 
                    className="create-team-button"
                    onClick={handleCreateTeam}
                >
                    Crear Equipo
                </button>
            </div>

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
                    <div className="sort-group">
                        <label>Ordenar por:</label>
                        <button
                            onClick={() => sortTeams('name')}
                            className={`sort-button ${sortConfig.key === 'name' ? 'active' : ''}`}
                        >
                            Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                        </button>
                        <button
                            onClick={() => sortTeams('current_players')}
                            className={`sort-button ${sortConfig.key === 'current_players' ? 'active' : ''}`}
                        >
                            Jugadores {sortConfig.key === 'current_players' && (sortConfig.direction === 'asc' ? '(↑)' : '(↓)')}
                        </button>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="teamName">Filtrar por Equipo:</label>
                        <select
                            id="teamName"
                            value={filters.name}
                            onChange={(e) => setFilters({...filters, name: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos los equipos</option>
                            {[...new Set(teams.map(t => t.name))].map((name, idx) => (
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
                            {games.map((game) => (
                                <option key={game.id} value={game.name}>
                                    {game.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="activeFilter">Filtrar por Estado:</label>
                        <select
                            id="activeFilter"
                            value={filters.is_active}
                            onChange={(e) => setFilters({...filters, is_active: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos</option>
                            <option value="true">Activos</option>
                            <option value="false">Inactivos</option>
                        </select>
                    </div>
                </div>
                
                <div className="teams-table">
                    <Table columns={columns} data={getFilteredAndSortedTeams()} />
                </div>
            </div>
        </div>
    );
}
