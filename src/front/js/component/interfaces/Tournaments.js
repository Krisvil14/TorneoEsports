import React, { useState, useEffect } from 'react';
import Table from '../commons/Table';
import { useNavigate } from 'react-router-dom';

export default function TournamentsInterface() {
    const [tournaments, setTournaments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + '/api/tournaments');
                const data = await response.json();
                setTournaments(data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };

        fetchTournaments();
    }, []);

    const handleCreateTournament = () => {
        navigate('/Cretournament');
    };

    const columns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Fecha de Inicio', accessor: 'date_start' },
        { header: 'Juego', accessor: 'game' },
        { header: 'Cantidad de Equipos', accessor: 'num_teams' },
        {
            header: 'Acciones',
            accessor: 'id',
            Cell: ({ value }) => (
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/addteam/${value}`)}
                >
                    Añadir Equipo
                </button>
            ),
        },
    ];

    return (
        <div className="container text-center">
            <h1 className="my-4">Gestión de Torneos</h1>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary my-2" onClick={handleCreateTournament}>
                        Crear Torneo
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Table columns={columns} data={tournaments} />
                </div>
            </div>
        </div>
    );
}
