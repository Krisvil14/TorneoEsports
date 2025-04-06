import React, { useState, useEffect } from 'react';
import Table from '../../commons/Table';


export default function TournamentsInterface() {
    const [tournaments, setTournaments] = useState([]);

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


    const columns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Fecha de Inicio', accessor: 'date_start' },
        { header: 'Juego', accessor: 'game' },
        { header: 'Cantidad de Equipos', accessor: 'num_teams' },
    ];

    return (
        <div className="container text-center">
            <h1 className="my-4">Gestión de Torneos</h1>
            <div className="row">
                <div className="col">
                    <Table columns={columns} data={tournaments} />
                </div>
            </div>
        </div>
    );
}
