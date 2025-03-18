import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../commons/Table';

export default function TeamsInterface() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);

    const handleCreateTeam = () => {
        navigate('/Regteams');
    };

    useEffect(() => {
        // Obtener los datos de los equipos desde el backend
        const fetchTeams = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + '/api/teams');
                const data = await response.json();
                setTeams(data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    const columns = [
        { header: 'Nombre del Equipo', accessor: 'name' },
        { header: 'Cantidad de Integrantes', accessor: 'members_count' },
        { header: 'Juego', accessor: 'game' }
    ];

    return (
        <div className="container text-center">
            <h1 className="my-4">Gestión de Equipos</h1>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary my-2" onClick={handleCreateTeam}>
                        Crear equipo
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Table columns={columns} data={teams} />
                </div>
            </div>
        </div>
    );
}
