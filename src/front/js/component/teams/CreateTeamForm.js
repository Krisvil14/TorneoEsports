import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Context } from '../../store/appContext';
import '../../../styles/createTeamForm.css';

export default function CreateTeamForm() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('game', game);

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

        const addPlayerResponse = await fetch(process.env.BACKEND_URL + '/api/add_player_to_team', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user_id: store.user.id, team_id: json.team_id })
        });

        if (addPlayerResponse.ok) {
          toast.success('Jugador añadido al equipo exitosamente');

          const updatedUser = { ...store.user, is_leader: true };
          await actions.updateUser(updatedUser);

          navigate('/teams');
          
          await actions.getUser();
        } else {
          toast.error('Error al agregar el jugador al equipo');
        }
      } else {
        toast.update(notification, {
          render: json.error || 'Error desconocido al registrar el equipo',
          type: 'error',
          autoClose: 5000,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error(err);
      toast.update(notification, {
        render: 'Error al registrar el equipo',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  return (
    <div className="create-team-container">
      <div className="create-team-hero">
        <h1>Registrar Equipo</h1>
      </div>
      <form onSubmit={handleSubmit} className="create-team-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Equipo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
            placeholder="Ingresa el nombre del equipo"
          />
        </div>
        <div className="form-group">
          <label htmlFor="game">Juego</label>
          <select
            id="game"
            name="game"
            value={game}
            onChange={({ target }) => setGame(target.value)}
            required
          >
            <option value="">Seleccione un juego</option>
            <option value="league_of_legends">League of Legends</option>
            <option value="valorant">Valorant</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">
            Registrar Equipo
          </button>
          <Link to="/teams" className="cancel-button">
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
}
