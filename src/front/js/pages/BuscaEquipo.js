import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../component/commons/Table';
import "../../styles/busca-equipo.css";

const BuscaEquipo = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

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
    { header: 'Juego', accessor: 'game' },
    { header: 'Jugadores', accessor: 'current_players', Cell: ({ row }) => `${row.current_players}/${row.max_players}` },
    {
      header: 'Actions',
      accessor: 'verInformacion',
      Cell: ({ row }) => (
        <button
          className="action-button"
          onClick={() => navigate(`/busca-equipo/${row.id}`)}
        >
          Ver Información
        </button>
      ),
    },
  ];

  return (
    <div className="busca-equipo-container">
      <section className="busca-equipo-hero">
        <h1>Buscar Equipo</h1>
      </section>
      
      <div className="busca-equipo-content">
        <div className="volver-container">
          <button 
            className="teams-button"
            onClick={() => navigate('/teams')}
          >
            Volver
          </button>
        </div>
        <div className="teams-table">
          <Table columns={columns} data={teams} />
        </div>
      </div>
    </div>
  );
};

export default BuscaEquipo;
