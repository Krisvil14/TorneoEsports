import React, { useState, useEffect } from 'react';
import Table from '../../commons/Table.js';
import "../../../../styles/users.css";

export default function RankingInterface() {
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'kda',
        direction: 'desc'
    });
    const [filters, setFilters] = useState({
        teamId: '',      // filtro por ID de equipo
        game: ''         // filtro por juego
    });

    const resetFilters = () => {
        setFilters({
            teamId: '',
            game: ''
        });
        setSortConfig({
            key: 'kda',
            direction: 'desc'
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener usuarios con sus estadísticas
                const usersResponse = await fetch(process.env.BACKEND_URL + '/api/users');
                const usersData = await usersResponse.json();
                
                // Obtener estadísticas para cada usuario
                const usersWithStats = await Promise.all(
                    usersData.map(async (user) => {
                        const statsResponse = await fetch(`${process.env.BACKEND_URL}/api/users/${user.id}/stats`);
                        const statsData = await statsResponse.json();
                        return { ...user, ...statsData };
                    })
                );
                
                setUsers(usersWithStats);

                // Obtener equipos
                const teamsResponse = await fetch(process.env.BACKEND_URL + '/api/teams');
                const teamsData = await teamsResponse.json();
                setTeams(teamsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Función para ordenar usuarios
    const sortUsers = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Función para obtener usuarios filtrados y ordenados
    const getFilteredAndSortedUsers = () => {
        let filteredUsers = [...users];

        // Filtrar usuarios que no son administradores
        filteredUsers = filteredUsers.filter(user => user.role !== 'admin');

        // Aplicar filtro por equipo
        if (filters.teamId) {
            filteredUsers = filteredUsers.filter(user => 
                user.team_id === parseInt(filters.teamId)
            );
        }

        // Aplicar filtro por juego
        if (filters.game) {
            filteredUsers = filteredUsers.filter(user => 
                user.team && user.team.game === filters.game
            );
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filteredUsers.sort((a, b) => {
                const aValue = a[sortConfig.key] || 0;
                const bValue = b[sortConfig.key] || 0;
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredUsers;
    };

    const columns = [
        { header: 'Nombre', accessor: 'first_name' },
        { header: 'Apellido', accessor: 'last_name' },
        { header: 'Equipo', accessor: 'team_name' },
        { 
            header: 'KDA',
            accessor: 'kda',
            Cell: ({ row }) => row.kda.toFixed(2)
        },
        { header: 'Kills', accessor: 'kills' },
        { header: 'Asistencias', accessor: 'assists' },
        { header: 'Muertes', accessor: 'deaths' }
    ];

    return (
        <div className="users-container">
            <section className="users-hero">
                <h1>Ranking de Jugadores</h1>
            </section>
            
            <div className="users-content">
                <div className="users-filters">
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
                            onClick={() => sortUsers('kda')}
                            className={`sort-button ${sortConfig.key === 'kda' ? 'active' : ''}`}
                        >
                            KDA {sortConfig.key === 'kda' && (sortConfig.direction === 'asc' ? '(Menor-Mayor)' : '(Mayor-Menor)')}
                        </button>
                        <button
                            onClick={() => sortUsers('kills')}
                            className={`sort-button ${sortConfig.key === 'kills' ? 'active' : ''}`}
                        >
                            Kills {sortConfig.key === 'kills' && (sortConfig.direction === 'asc' ? '(Menor-Mayor)' : '(Mayor-Menor)')}
                        </button>
                        <button
                            onClick={() => sortUsers('assists')}
                            className={`sort-button ${sortConfig.key === 'assists' ? 'active' : ''}`}
                        >
                            Asistencias {sortConfig.key === 'assists' && (sortConfig.direction === 'asc' ? '(Menor-Mayor)' : '(Mayor-Menor)')}
                        </button>
                        <button
                            onClick={() => sortUsers('deaths')}
                            className={`sort-button ${sortConfig.key === 'deaths' ? 'active' : ''}`}
                        >
                            Muertes {sortConfig.key === 'deaths' && (sortConfig.direction === 'asc' ? '(Menor-Mayor)' : '(Mayor-Menor)')}
                        </button>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="teamId">Filtrar por Equipo:</label>
                        <select
                            id="teamId"
                            value={filters.teamId}
                            onChange={(e) => setFilters({...filters, teamId: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos los equipos</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>
                                    {team.name} ({team.game})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="game">Filtrar por Juego:</label>
                        <select
                            id="game"
                            value={filters.game}
                            onChange={(e) => setFilters({...filters, game: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos los juegos</option>
                            <option value="League of Legends">League of Legends</option>
                            <option value="Valorant">Valorant</option>
                        </select>
                    </div>
                </div>
                
                <div className="users-table">
                    <Table columns={columns} data={getFilteredAndSortedUsers()} />
                </div>
            </div>
        </div>
    );
} 