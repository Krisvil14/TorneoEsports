import React, { useState, useEffect } from 'react';
import Table from '../../../commons/Table';
import { useNavigate } from 'react-router-dom';
import "../../../../../styles/users.css";

export default function UsersAdminInterface() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);

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
                
                <div className="users-table">
                    <Table columns={columns} data={users} />
                </div>
            </div>
        </div>
    );
}
