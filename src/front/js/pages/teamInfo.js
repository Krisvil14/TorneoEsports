import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../component/commons/Table';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

export default function TeamInfo() {
    const { teamId } = useParams();
    const { store, actions } = useContext(Context);
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isLeader, setIsLeader] = useState(false);
    const navigate = useNavigate();
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

        const fetchApplications = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/applications/team/${teamId}`);
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchTeam();
        fetchUsers();
        fetchApplications();
    }, [teamId]);

    useEffect(() => {
        if (store.user && team) {
            const currentUser = users.find(user => user.id === store.user.id);
            setIsLeader(currentUser?.is_leader || false);
        }
    }, [store.user, team, users]);

    const handleApplication = async (applicationId, accepted) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/handle_application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    application_id: applicationId,
                    accepted: accepted
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al procesar la solicitud');
            }

            // Recargar la página después de procesar la solicitud
            window.location.reload();
        } catch (error) {
            console.error('Error handling application:', error);
            alert('Error al procesar la solicitud: ' + error.message);
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

    const applicationsData = applications
        .filter(app => app.action === 'join_team' && app.status === 'pending' && app.user)
        .map(app => ({
            Usuario: app.user.first_name + ' ' + app.user.last_name,
            Estado: app.user.is_active ? 'Activo' : 'Inactivo',
            Acciones: (
                <div>
                    <button 
                        className="btn btn-success me-2" 
                        onClick={() => handleApplication(app.id, true)}
                    >
                        Aceptar
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={() => handleApplication(app.id, false)}
                    >
                        Rechazar
                    </button>
                </div>
            )
        }));

    const applicationsColumns = [
        { header: "Usuario", accessor: "Usuario" },
        { header: "Estado", accessor: "Estado" },
        { header: "Acciones", accessor: "Acciones" }
    ];

    return (
        <div className="container text-center">
            <Link to="/teams" className="btn btn-primary w-50 w-md-75 my-5">
                Volver
            </Link>
            <Table data={teamData} columns={teamColumns} />
            <h3>Integrantes:</h3>
            <Table data={usersData} columns={usersColumns} />
            
            {isLeader && (
                <>
                    <h3>Solicitudes:</h3>
                    {applicationsData.length > 0 ? (
                        <Table data={applicationsData} columns={applicationsColumns} />
                    ) : (
                        <p>No hay solicitudes pendientes</p>
                    )}
                </>
            )}
        </div>
    );
}
