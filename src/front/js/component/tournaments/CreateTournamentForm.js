import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreateTournamentForm() {
    const [name, setName] = useState('');
    const [numMaxTeams, setNumMaxTeams] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [game, setGame] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('num_max_teams', numMaxTeams);
        formData.append('date_start', dateStart);
        formData.append('game', game);

        const notification = toast.loading('Creando torneo...');

        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/create_tournament', {
                method: 'POST',
                body: formData,
            });

            const { ok } = response;
            const json = await response.json();

            if (ok) {
                toast.update(notification, {
                    render: 'Torneo creado con éxito',
                    type: 'success',
                    autoClose: 5000,
                    isLoading: false,
                });
                navigate('/tournaments');
            } else {
                toast.update(notification, {
                    render: json.error,
                    type: 'error',
                    autoClose: 5000,
                    isLoading: false,
                });
            }
        } catch (err) {
            console.error(err);
            toast.update(notification, {
                render: 'Error al crear el torneo',
                type: 'error',
                autoClose: 5000,
                isLoading: false,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-4 text-center">
                <h1 className="w-75 mx-auto fs-1">Crear Torneo</h1>
            </div>
            <div className="row gy-3">
                <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
                    <label htmlFor="name">Nombre del Torneo:</label>
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
                    <label htmlFor="numMaxTeams">Cantidad de Equipos:</label>
                    <input
                        type="number"
                        id="numMaxTeams"
                        name="numMaxTeams"
                        value={numMaxTeams}
                        onChange={({ target }) => setNumMaxTeams(target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
                    <label htmlFor="dateStart">Fecha de Inicio:</label>
                    <input
                        type="date"
                        id="dateStart"
                        name="dateStart"
                        value={dateStart}
                        onChange={({ target }) => setDateStart(target.value)}
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
                <button type="submit" className="btn btn-primary w-75 mx-auto">
                    Crear Torneo
                </button>
            </div>
        </form>
    );
}
