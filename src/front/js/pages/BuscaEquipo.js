import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  Table  from '../component/commons/Table';

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
  { header: 'Jugadores', accessor: 'member_count' },
  {
   header: 'Actions',
   accessor: 'verInformacion',
   Cell: ({ row }) => (
    <button
     className="btn btn-primary"
     onClick={() => navigate(`/busca-equipo/${row.id}`)}
    >
     Ver Información
    </button>
   ),
  },
 ];

  return (
    <div className="container text-center">
      <h1>Buscar Equipo</h1>
      <div className="row">
        <div className="col">
          <Table columns={columns} data={teams} />
        </div>
      </div>
    </div>
  );
};

export default BuscaEquipo;
