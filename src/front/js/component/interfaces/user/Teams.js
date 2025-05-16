import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../commons/Table';
import { Context } from '../../../store/appContext';
import '../../../../styles/teams.css';

export default function TeamsInterface() {
  const { store, actions } = useContext(Context);
  const user = store.user;
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!userFetched) {
        actions.getUser();
        setUserFetched(true);
      }

      if (user) {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + `/api/teams/user/${user.id}`
          );
          const data = await response.json();
          setTeams(data);
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
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
          className="action-button"
          onClick={() => navigate(`/teamInfo/${row.id}`)}
        >
          Ver Información
        </button>
      ),
    },
  ];

  return (
    <div className="teams-container">
      <section className="teams-hero">
        <h1>Gestión de Equipos</h1>
      </section>

      <div className="teams-content">
        {user && user.is_in_team ? (
          <div className="teams-table">
            <Table columns={columns} data={teams} />
          </div>
        ) : (
          <div className="button-container">
            <button
              className="create-team-button"
              onClick={() => navigate('/create-team')}
            >
              Crear Equipo
            </button>
            <button
              className="search-team-button"
              onClick={() => navigate('/busca-equipo')}
            >
              Buscar Equipo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
