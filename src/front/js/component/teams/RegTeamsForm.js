import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function RegTeamsForm() {
  const [name, setName] = React.useState('');
  const [membersCount, setMembersCount] = React.useState('');
  const [game, setGame] = React.useState('');
  const [tournament, setTournament] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('members_count', membersCount);
    formData.append('game', game);
    formData.append('tournament', tournament);
    

    const notification = toast.loading('Registrando equipo...');
    
    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/Regteams', {
        method: 'POST',
        body: formData,
      });

      const { ok } = response;
      const json = await response.json();

      if (ok) {
        toast.update(notification, {
          render: 'Equipo registrado con éxito',
          type: 'success',
          autoClose: 5000,
          isLoading: false,
        });
        navigate('/Regteams');

      } else {
        toast.update(notification, {
          render: json.error,
          type: 'error',
          autoClose: 5000,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log(err);
      toast.update(notification, {
        render: 'Error al registrar el equipo',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row mb-4 text-center">
        <h1 className="w-75 mx-auto fs-1">Registrar Equipo</h1>
      </div>
      <div className="row gy-3">
        <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
          <label htmlFor="name">Nombre del Equipo:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
          <label htmlFor="membersCount">Cantidad de Integrantes:</label>
          <input
            type="number"
            id="membersCount"
            name="membersCount"
            value={membersCount}
            onChange={({ target }) => setMembersCount(target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
          <label htmlFor="game">Juego:</label>
          <input
            type="text"
            id="game"
            name="game"
            value={game}
            onChange={({ target }) => setGame(target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
          <label htmlFor="tournament">Torneo:</label>
          <input
            type="text"
            id="tournament"
            name="tournament"
            value={tournament}
            onChange={({ target }) => setTournament(target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-75 mx-auto">
          Registrar
        </button>
      </div>
    </form>
  );
}