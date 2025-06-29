import React, { useState, useEffect } from 'react';
import Table from '../../../commons/Table';
import { useNavigate } from 'react-router-dom';
import "../../../../../styles/tournaments.css";
import { toast } from 'react-toastify';

export default function TournamentsAdminInterface() {
    const [tournaments, setTournaments] = useState([]);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc'
    });
    const [filters, setFilters] = useState({
        name: '',
        game: '',
        started: '',
        finished: ''
    });
    const navigate = useNavigate();

    const resetFilters = () => {
        setFilters({
            name: '',
            game: '',
            started: '',
            finished: ''
        });
        setSortConfig({
            key: 'name',
            direction: 'asc'
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar torneos
                const tournamentsResponse = await fetch(process.env.BACKEND_URL + '/api/tournaments');
                if (tournamentsResponse.ok) {
                    const tournamentsData = await tournamentsResponse.json();
                    setTournaments(tournamentsData);
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

    const handleCreateTournament = () => {
        navigate('/admin/create_tournament');
    };

    // Función para ordenar torneos
    const sortTournaments = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
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

        // Aplicar filtro por estado de inicio
        if (filters.started !== '') {
            const startedValue = filters.started === 'true';
            filteredTournaments = filteredTournaments.filter(tournament => 
                tournament.started === startedValue
            );
        }

        // Aplicar filtro por estado de finalización
        if (filters.finished !== '') {
            const finishedValue = filters.finished === 'true';
            filteredTournaments = filteredTournaments.filter(tournament => 
                tournament.finished === finishedValue
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
        { 
            header: 'Fecha de Inicio', 
            accessor: 'date_start',
            Cell: ({ value }) => {
                if (!value) return '';
                try {
                    const datePart = value.split('T')[0];
                    const [year, month, day] = datePart.split('-');
                    return `${day}/${month}/${year}`;
                } catch (e) {
                    return value;
                }
            }
        },
        { header: 'Juego', accessor: 'game' },
        { 
            header: 'Cantidad de Equipos', 
            accessor: 'num_teams',
            Cell: ({ row }) => `${row.num_teams}/${row.num_max_teams}`
        },
        {
            header: 'Formato',
            accessor: 'match_format',
            Cell: ({ row }) => {
                const formatMap = {
                    'best_of_1': 'Mejor de 1',
                    'best_of_3': 'Mejor de 3',
                    'best_of_5': 'Mejor de 5'
                };
                const finalFormatMap = {
                    'best_of_3': 'Mejor de 3',
                    'best_of_5': 'Mejor de 5',
                    'best_of_7': 'Mejor de 7'
                };
                return (
                    <div>
                        <div><strong>Partida:</strong> {formatMap[row.match_format] || row.match_format}</div>
                        <div><strong>Final:</strong> {finalFormatMap[row.final_format] || row.final_format}</div>
                    </div>
                );
            }
        },
        {
            header: 'Iniciado',
            accessor: 'started',
            Cell: ({ value }) => value ? '✅' : '❌'
        },
        {
            header: 'Finalizado',
            accessor: 'finished',
            Cell: ({ value }) => value ? '✅' : '❌'
        },
        {
            header: 'Acciones',
            accessor: 'id',
            Cell: ({ value }) => (
                <div className="action-buttons">
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

    if (loading) {
        return <div>Cargando...</div>;
    }

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
                            {games.map((game) => (
                                <option key={game.id} value={game.name}>
                                    {game.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="startedFilter">Filtrar por Estado de Inicio:</label>
                        <select
                            id="startedFilter"
                            value={filters.started}
                            onChange={(e) => setFilters({...filters, started: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos</option>
                            <option value="true">Iniciados</option>
                            <option value="false">No Iniciados</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="finishedFilter">Filtrar por Estado de Finalización:</label>
                        <select
                            id="finishedFilter"
                            value={filters.finished}
                            onChange={(e) => setFilters({...filters, finished: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos</option>
                            <option value="true">Finalizados</option>
                            <option value="false">No Finalizados</option>
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
