import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function RegTeamsForm() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('game', game);

    const notification = toast.loading('Registrando equipo...');

    try {
      const response = await fetch(process.env.BACKEND_URL + '/api/admin/Regteams', {
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
        navigate('/admin/teams');
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
          <label htmlFor="game">Juego:</label>
          <select
            id="game"
            name="game"
            value={game}
            onChange={({ target }) => setGame(target.value)}
            required
            className="form-control"
          >
            <option value="">Seleccione un juego</option>
            <option value="league_of_legends">League of Legends</option>
            <option value="valorant">Valorant</option>
          </select>
        </div>
        <div className="d-flex w-75 justify-content-center flex-column flex-md-row gap-2 mx-auto">
                  <button type="submit" className="btn btn-primary w-100 w-md-75">
                    Registratr Equipo
                  </button>
                  <Link to="/admin/teams" className="btn btn-secondary w-100 w-md-75">
                    Volver
                  </Link>
                </div>
      </div>
    </form>
  );
}
