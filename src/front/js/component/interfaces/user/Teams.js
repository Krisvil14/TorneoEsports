import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../commons/Table';
import { Context } from '../../../store/appContext';

export default function TeamsInterface() {
    const { store, actions } = useContext(Context);
    const user = store.user;
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [userFetched, setUserFetched] = useState(false); // Add a new state variable

    useEffect(() => {
        const fetchTeams = async () => {
            if (!userFetched) { // Add a conditional statement
                actions.getUser();
                setUserFetched(true); // Set the state variable to true
            }

            if (user) {
                try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/teams/user/${user.id}`);
                    const data = await response.json();
                    setTeams(data);
                } catch (error) {
                    console.error('Error fetching teams:', error);
                }
            }
        };

        fetchTeams();
    }, [user]); // Add the user object to the dependency array

    const columns = [
        { header: 'Nombre del Equipo', accessor: 'name' },
        { header: 'Juego', accessor: 'game' },
        {
            header: 'Ver Información',
            accessor: 'verInformacion',
            Cell: ({ row }) => (
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/teamInfo/${row.id}`)}
                >
                    Ver Información
                </button>
            ),
        },
    ];

    return (
        <div className="container text-center">
            <h1 className="my-4">Gestión de Equipos</h1>
            {user && user.is_in_team ? (
                <div className="row">
                    <div className="col">
                        <Table columns={columns} data={teams} />
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col">
                    <button className="btn btn-primary me-2" onClick={() => navigate('/create-team')}>Crear Equipo</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/busca-equipo')}>Buscar Equipo</button>
                    </div>
                </div>
            )}
        </div>
    );
}
