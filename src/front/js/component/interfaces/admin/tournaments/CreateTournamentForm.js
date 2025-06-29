import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../../../styles/gaming-form.css';

export default function CreateTournamentForm() {
    const [name, setName] = useState('');
    const [date_start, setDateStart] = useState('');
    const [num_max_teams, setNumMaxTeams] = useState('');
    const [game, setGame] = useState('');
    const [cost, setCost] = useState(10);
    const [prize, setPrize] = useState('');
    const [match_format, setMatchFormat] = useState('best_of_3');
    const [final_format, setFinalFormat] = useState('best_of_5');
    const [custom_rules, setCustomRules] = useState('');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Cargar juegos al montar el componente
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + '/api/games');
                if (response.ok) {
                    const gamesData = await response.json();
                    setGames(gamesData);
                } else {
                    toast.error('Error al cargar los juegos');
                }
            } catch (error) {
                console.error('Error fetching games:', error);
                toast.error('Error al cargar los juegos');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('date_start', date_start);
        formData.append('num_max_teams', num_max_teams);
        formData.append('game', game);
        formData.append('cost', cost);
        formData.append('prize', prize);
        formData.append('match_format', match_format);
        formData.append('final_format', final_format);
        formData.append('custom_rules', custom_rules);

        const notification = toast.loading('Creando torneo...');

        try {
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
                    render: json.error || 'Error desconocido al crear el torneo',
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
                    <label className="gaming-form-label" htmlFor="date_start">Fecha de Inicio:</label>
                    <input
                        type="date"
                        id="date_start"
                        name="date_start"
                        value={date_start}
                        onChange={({ target }) => setDateStart(target.value)}
                        required
                        className="gaming-form-input form-control"
                    />
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="num_max_teams">Cantidad de Equipos:</label>
                    <select
                        id="num_max_teams"
                        name="num_max_teams"
                        value={num_max_teams}
                        onChange={({ target }) => setNumMaxTeams(target.value)}
                        required
                        className="gaming-form-input form-control"
                    >
                        <option value="">Seleccione el número de equipos</option>
                        <option value="4">4 equipos</option>
                        <option value="8">8 equipos</option>
                        <option value="16">16 equipos</option>
                    </select>
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="game">Juego:</label>
                    <select
                        id="game"
                        name="game"
                        value={game}
                        onChange={({ target }) => setGame(target.value)}
                        required
                        disabled={loading}
                        className="gaming-form-input form-control"
                    >
                        <option value="">
                            {loading ? 'Cargando juegos...' : 'Seleccione un juego'}
                        </option>
                        {games.map((gameItem) => (
                            <option key={gameItem.id} value={gameItem.name}>
                                {gameItem.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="cost">Costo de Inscripción:</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={cost}
                        onChange={({ target }) => setCost(target.value)}
                        required
                        min="0"
                        className="gaming-form-input form-control"
                    />
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="prize">Valor del Premio:</label>
                    <input
                        type="number"
                        id="prize"
                        name="prize"
                        value={prize}
                        onChange={({ target }) => setPrize(target.value)}
                        required
                        className="gaming-form-input form-control"
                    />
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="match_format">Formato de Partida:</label>
                    <select
                        id="match_format"
                        name="match_format"
                        value={match_format}
                        onChange={({ target }) => setMatchFormat(target.value)}
                        required
                        className="gaming-form-input form-control"
                    >
                        <option value="best_of_1">Mejor de 1</option>
                        <option value="best_of_3">Mejor de 3</option>
                        <option value="best_of_5">Mejor de 5</option>
                    </select>
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="final_format">Formato de Final:</label>
                    <select
                        id="final_format"
                        name="final_format"
                        value={final_format}
                        onChange={({ target }) => setFinalFormat(target.value)}
                        required
                        className="gaming-form-input form-control"
                    >
                        <option value="best_of_3">Mejor de 3</option>
                        <option value="best_of_5">Mejor de 5</option>
                        <option value="best_of_7">Mejor de 7</option>
                    </select>
                </div>

                <div className="gaming-form-group">
                    <label className="gaming-form-label" htmlFor="custom_rules">Reglas Adicionales (Opcional):</label>
                    <textarea
                        id="custom_rules"
                        name="custom_rules"
                        value={custom_rules}
                        onChange={({ target }) => setCustomRules(target.value)}
                        rows="4"
                        placeholder="Agregue reglas adicionales específicas para este torneo..."
                        className="gaming-form-input form-control"
                    />
                </div>

                <div className="gaming-form-buttons">
                    <button type="submit" className="gaming-form-button primary" disabled={loading}>
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
