import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../component/commons/Table';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '../store/appContext';

export default function TeamInfoUser() {
    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [hasRequested, setHasRequested] = useState(false);
    const { store } = React.useContext(Context);

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

        const checkRequestStatus = async () => {
            if (!store.user || !store.user.id) {
                console.log('No user logged in');
                return;
            }

            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/team-requests/check/${teamId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user_id': store.user.id.toString()
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error checking request:', errorData);
                    return;
                }

                const data = await response.json();
                setHasRequested(data.hasRequested);
            } catch (error) {
                console.error('Error checking request status:', error);
            }
        };

        fetchTeam();
        fetchUsers();
        checkRequestStatus();
    }, [teamId, store.user]);

    const handleJoinRequest = async () => {
        if (!store.user || !store.user.id) {
            toast.error('Debes iniciar sesión para solicitar unirte a un equipo');
            return;
        }

        if (hasRequested) {
            toast.warning('Ya has solicitado unirte a este equipo');
            return;
        }

        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/team-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: store.user.id,
                    team_id: teamId
                })
            });

            if (response.ok) {
                setHasRequested(true);
                toast.success('Solicitud hecha exitosamente');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Error al realizar la solicitud');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error('Error al realizar la solicitud');
        }
    };

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
            <div className="d-flex justify-content-center gap-3">
            <Link to="/busca-equipo" className="btn btn-primary w-50 w-md-75 my-5">
                Volver
            </Link>
            <button 
                onClick={handleJoinRequest}
                className="btn btn-secondary w-50 w-md-75 my-5"
                disabled={hasRequested}
            >
                {hasRequested ? 'Solicitud ya enviada' : 'Solicitar unirse al equipo'}
            </button>
            </div>
            <Table data={teamData} columns={teamColumns} />
            <h3>Integrantes:</h3>
            <Table data={usersData} columns={usersColumns} />
        </div>
    );
}
