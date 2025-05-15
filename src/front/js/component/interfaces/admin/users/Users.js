import React, { useState, useEffect } from 'react';
import Table from '../../../commons/Table';
import { useNavigate } from 'react-router-dom';
import "../../../../../styles/users.css";

export default function UsersAdminInterface() {
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'first_name',
        direction: 'asc'
    });
    const [filters, setFilters] = useState({
        teamStatus: '',  // '' = todos, 'true' = en equipo, 'false' = sin equipo
        teamId: ''      // filtro por ID de equipo
    });
    const navigate = useNavigate();

    const resetFilters = () => {
        setFilters({
            teamStatus: '',
            teamId: ''
        });
        setSortConfig({
            key: 'first_name',
            direction: 'asc'
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener usuarios
                const usersResponse = await fetch(process.env.BACKEND_URL + '/api/users');
                const usersData = await usersResponse.json();
                setUsers(usersData);

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
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Función para obtener usuarios filtrados y ordenados
    const getFilteredAndSortedUsers = () => {
        let filteredUsers = [...users];

        // Aplicar filtro por estado de equipo
        if (filters.teamStatus !== '') {
            filteredUsers = filteredUsers.filter(user => 
                user.is_in_team === (filters.teamStatus === 'true')
            );
        }

        // Aplicar filtro por equipo específico
        if (filters.teamId) {
            filteredUsers = filteredUsers.filter(user => 
                user.team_id === parseInt(filters.teamId)
            );
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filteredUsers.sort((a, b) => {
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

        return filteredUsers;
    };

    const columns = [
        { header: 'Nombre', accessor: 'first_name' },
        { header: 'Apellido', accessor: 'last_name' },
        { header: 'Cédula', accessor: 'cedula' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'En Equipo',
            accessor: 'is_in_team',
            Cell: ({ row }) => (row.is_in_team ? '✔' : 'X'),
        },
        { header: 'Equipo asignado', accessor: 'team_name' },
        {
            header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => {
                return !row.is_in_team ? (
                    <button
                        className="gaming-button primary"
                        onClick={() => navigate(`/admin/add_player_to_team/${row.id}`)}
                    >
                        Añadir A Equipo
                    </button>
                ) : (
                    <button
                        className="gaming-button danger"
                        onClick={async () => {
                            try {
                                const response = await fetch(process.env.BACKEND_URL + `/api/admin/add_player_to_team/${row.id}`, {
                                    method: 'POST',
                                    body: new FormData(),
                                });
                                if (response.ok) {
                                    const fetchUsers = async () => {
                                        try {
                                            const response = await fetch(process.env.BACKEND_URL + '/api/users');
                                            const data = await response.json();
                                            setUsers(data);
                                        } catch (error) {
                                            console.error('Error fetching users:', error);
                                        }
                                    };
                                    fetchUsers();
                                } else {
                                    console.error('Error removing user from team');
                                }
                            } catch (error) {
                                console.error('Error removing user from team:', error);
                            }
                        }}
                    >
                        Remover De Equipo
                    </button>
                );
            },
        },
    ];

    return (
        <div className="users-container">
            <section className="users-hero">
                <h1>Gestión de Usuarios</h1>
            </section>
            
            <div className="users-content">
                <div className="button-container">
                    <button 
                        className="gaming-button primary"
                        onClick={() => navigate('/admin/create_user')}
                    >
                        Crear Usuario
                    </button>
                </div>

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
                            onClick={() => sortUsers('first_name')}
                            className={`sort-button ${sortConfig.key === 'first_name' ? 'active' : ''}`}
                        >
                            Nombre {sortConfig.key === 'first_name' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                        </button>
                        <button
                            onClick={() => sortUsers('last_name')}
                            className={`sort-button ${sortConfig.key === 'last_name' ? 'active' : ''}`}
                        >
                            Apellido {sortConfig.key === 'last_name' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                        </button>
                        <button
                            onClick={() => sortUsers('email')}
                            className={`sort-button ${sortConfig.key === 'email' ? 'active' : ''}`}
                        >
                            Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '(A-Z)' : '(Z-A)')}
                        </button>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="teamStatus">Estado en Equipo:</label>
                        <select
                            id="teamStatus"
                            value={filters.teamStatus}
                            onChange={(e) => setFilters({...filters, teamStatus: e.target.value})}
                            className="form-control"
                        >
                            <option value="">Todos</option>
                            <option value="true">En Equipo</option>
                            <option value="false">Sin Equipo</option>
                        </select>
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
                </div>
                
                <div className="users-table">
                    <Table columns={columns} data={getFilteredAndSortedUsers()} />
                </div>
            </div>
        </div>
    );
}
