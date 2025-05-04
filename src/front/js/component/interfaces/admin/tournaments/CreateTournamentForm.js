import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../../../styles/gaming-form.css';

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
            console.log("Form data:", Object.fromEntries(formData));
            const response = await fetch(process.env.BACKEND_URL + '/api/admin/create_tournament', {
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
                navigate('/admin/tournaments');
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
        <div className="gaming-form-container">
            <form onSubmit={handleSubmit}>
                <h1 className="gaming-form-title text-center">Crear Torneo</h1>
                
                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="name">Nombre del Torneo:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                        required
                        className="gaming-form-input form-control"
                    />
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="numMaxTeams">Cantidad de Equipos:</label>
                    <input
                        type="number"
                        id="numMaxTeams"
                        name="numMaxTeams"
                        value={numMaxTeams}
                        onChange={({ target }) => setNumMaxTeams(target.value)}
                        required
                        className="gaming-form-input form-control"
                    />
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="dateStart">Fecha de Inicio:</label>
                    <input
                        type="date"
                        id="dateStart"
                        name="dateStart"
                        value={dateStart}
                        onChange={({ target }) => setDateStart(target.value)}
                        required
                        className="gaming-form-input form-control"
                    />
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="game">Juego:</label>
                    <select
                        id="game"
                        name="game"
                        value={game}
                        onChange={({ target }) => setGame(target.value)}
                        required
                        className="gaming-form-input form-control"
                    >
                        <option value="">Seleccione un juego</option>
                        <option value="league_of_legends">League of Legends</option>
                        <option value="valorant">Valorant</option>
                    </select>
                </div>

                <div className="gaming-form-buttons">
                    <button type="submit" className="gaming-form-button primary">
                        Crear Torneo
                    </button>
                    <Link to="/admin/tournaments" className="gaming-form-button secondary">
                        Volver
                    </Link>
                </div>
            </form>
        </div>
    );
}
