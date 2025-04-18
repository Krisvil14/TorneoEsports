import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../commons/Table';
import { Context } from '../../../store/appContext';

export default function TeamsInterface() {
    const { store } = useContext(Context);
    const user = store.user;
    const navigate = useNavigate();

    return (
        <div className="container text-center">
            <h1 className="my-4">Gestión de Equipos</h1>
            {user && user.is_in_team ? (
                <>
                    {(() => {
                        const [teams, setTeams] = useState([]);
                        useEffect(() => {
                            // Obtener los datos de los equipos desde el backend
                            const fetchTeams = async () => {
                                try {
                                    const response = await fetch(process.env.BACKEND_URL + `/api/teams/user/${user.id}`);
                                    const data = await response.json();
                                    setTeams(data);
                                } catch (error) {
                                    console.error('Error fetching teams:', error);
                                }
                            };

                            fetchTeams();
                        }, [user]);
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
                            <div className="row">
                                <div className="col">
                                    <Table columns={columns} data={teams} />
                                </div>
                            </div>
                        );
                    })()}
                </>
            ) : (
                <div className="row">
                    <div className="col">
                        <button className="btn btn-primary" onClick={() => navigate('/create-team')}>Crear Equipo</button>
                        <button className="btn btn-secondary">Buscar Equipo</button>
                    </div>
                </div>
            )}
        </div>
    );
}
