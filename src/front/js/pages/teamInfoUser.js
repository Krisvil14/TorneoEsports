import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../component/commons/Table';
import { Link } from 'react-router-dom';

export default function TeamInfoUser() {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}`);
                const data = await response.json();
                setTeam(data);
            } catch (error) {
                console.error('Error fetching team:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/teams/${teamId}/users`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchTeam();
        fetchUsers();
    }, [teamId]);

    if (!team) {
        return <div>Loading...</div>;
    }

    const teamData = [
        { "Nombre del Equipo": team.name, "Juego asociado": team.game }
    ];

    const teamColumns = [
        { header: "Nombre del Equipo", accessor: "Nombre del Equipo" },
        { header: "Juego asociado", accessor: "Juego asociado" }
    ];

    const usersData = users.map(user => ({
        Nombre: user.first_name,
        Apellido: user.last_name,
        Cedula: user.cedula,
        Correo: user.email,
        Edad: user.age
    }));

    const usersColumns = [
        { header: "Nombre", accessor: "Nombre" },
        { header: "Apellido", accessor: "Apellido" },
        { header: "Cedula", accessor: "Cedula" },
        { header: "Correo", accessor: "Correo" },
        { header: "Edad", accessor: "Edad" }
    ];

    return (
        <div className="container text-center">
                <Link to="/busca-equipo" className="btn btn-primary w-50 w-md-75 my-5">
                    Volver
                </Link>
                <Link to="/" className="btn btn-secondary w-50 w-md-75 my-5">
                    Solicitar unirse al equipo
                </Link>
            <Table data={teamData} columns={teamColumns} />
            <h3>Integrantes:</h3>
            <Table data={usersData} columns={usersColumns} />
        </div>
    );
}
