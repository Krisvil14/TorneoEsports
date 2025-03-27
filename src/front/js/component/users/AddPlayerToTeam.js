import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddPlayerToTeam() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/users/${user_id}`);
                const data = await response.json();
                setUser(data);

                // Fetch teams after user data is loaded
                const fetchTeams = async () => {
                    try {
                        const response = await fetch(process.env.BACKEND_URL + `/api/teams`);
                        const teamData = await response.json();
                        setTeams(teamData);
                    } catch (error) {
                        console.error('Error fetching teams:', error);
                    }
                };

                fetchTeams();

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const notification = toast.loading('Añadiendo jugador al equipo...');

        try {
            const formData = new FormData();
            formData.append('team_id', selectedTeam);

            const response = await fetch(process.env.BACKEND_URL + `/api/add_player_to_team/${user_id}`, {
                method: 'POST',
                body: formData,
            });

            const responseData = await response.json();
            const { ok } = response;

            if (ok) {
                toast.update(notification, {
                    render: 'Jugador añadido al equipo con éxito',
                    type: 'success',
                    autoClose: 5000,
                    isLoading: false,
                });
                navigate(`/users`);
            } else {
                toast.update(notification, {
                    render: responseData.error || 'Error al añadir el jugador al equipo',
                    type: 'error',
                    autoClose: 5000,
                    isLoading: false,
                });
            }
        } catch (err) {
            console.error(err);
            toast.update(notification, {
                render: 'Error al añadir el jugador al equipo',
                type: 'error',
                autoClose: 5000,
                isLoading: false,
            });
        }
    };

    return (
        user && !user.is_in_team ? (
            <form onSubmit={handleSubmit}>
                <div className="row mb-4 text-center">
                    <h1 className="w-75 mx-auto fs-1">Añadir Jugador al Equipo</h1>
                </div>
                <div className="row gy-3">
                    <div className="d-flex flex-column gy-3 w-75 mx-auto form-group">
                        <label htmlFor="team">Equipo:</label>
                        <select
                            id="team"
                            name="team"
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            required
                            className="form-control"
                        >
                            <option value="">Seleccione un equipo</option>
                            {teams && teams.map((team) => {
                                return (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-75 mx-auto">
                        Añadir Jugador
                    </button>
                </div>
            </form>
        ) : (
            <div className="row mb-4 text-center">
                <h1 className="w-75 mx-auto fs-1">Jugador ya está en un equipo</h1>
            </div>
        )
    );
}
