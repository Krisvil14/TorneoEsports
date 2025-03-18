import React, { useState, useEffect } from 'react';
import Table from '../commons/Table';

export default function UsersInterface() {
    const [users, setUsers] = useState([]);

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
        { header: 'En Equipo', accessor: 'is_in_team' },
    ];

    return (
        <div className="container text-center">
            <h1 className="my-4">Gestión de Usuarios</h1>
            <div className="row">
                <div className="col">
                    <Table columns={columns} data={users} />
                </div>
            </div>
        </div>
    );
}
