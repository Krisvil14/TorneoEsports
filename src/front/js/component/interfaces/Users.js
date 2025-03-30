import React, { useState, useEffect } from 'react';
import Table from '../commons/Table';
import { useNavigate } from 'react-router-dom';


export default function UsersInterface() {
    const [users, setUsers] = useState([]);
     const navigate = useNavigate();

     const handleCreateTeam = () => {
        navigate('/Regteams');
    };

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
            Cell: ({ row }) => (
                !row.is_in_team ? (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/add_player_to_team/${row.id}`)}
                    >
                        Añadir A Equipo
                    </button>
                ) : null
            ),
        },
    ];

    return (
        <div className="container text-center">
            <h1 className="my-4">Gestión de Usuarios</h1>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary my-2" onClick={() => navigate('/create_user')}>
                        Crear Usuario
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Table columns={columns} data={users} />
                </div>
            </div>
        </div>
    );
}
