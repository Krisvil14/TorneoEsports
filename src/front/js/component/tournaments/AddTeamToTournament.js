import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddTeamToTournament() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const navigate = useNavigate();
    const { tournament_id } = useParams();
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + `/api/tournaments/${tournament_id}`);
                const data = await response.json();
                setTournament(data);
                console.log("Tournament data:", data);

                // Fetch teams after tournament data is loaded
                const fetchTeams = async () => {
                    let teamData; // Declare teamData outside the try block
                    try {
                        const response = await fetch(process.env.BACKEND_URL + `/api/teams`);
                        let teamData;
                        teamData = await response.json();
                        const filteredTeams = teamData.filter(team => team.game === data?.game);
                        setTeams(filteredTeams);
                        console.log("Teams data:", teamData);
                    } catch (error) {
                        console.error('Error fetching teams:', error);
                    }
                };

                fetchTeams();

            } catch (error) {
                console.error('Error fetching tournament:', error);
            }
        };

        fetchTournament();
    }, [tournament_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('team_id', selectedTeam);

        const notification = toast.loading('Añadiendo equipo al torneo...');

        try {
            const response = await fetch(process.env.BACKEND_URL + `/api/tournaments/${tournament_id}/teams`, {
                method: 'POST',
                body: formData,
            });

            const { ok } = response;
            const json = await response.json();

            if (ok) {
                toast.update(notification, {
                    render: 'Equipo añadido al torneo con éxito',
                    type: 'success',
                    autoClose: 5000,
                    isLoading: false,
                });
                navigate(`/tournaments`);
            } else {
                toast.update(notification, {
                    render: 'Error al añadir el equipo al torneo',
                    type: 'error',
                    autoClose: 5000,
                    isLoading: false,
                });
            }
        } catch (err) {
            console.error(err);
            toast.update(notification, {
                render: 'Error al añadir el equipo al torneo',
                type: 'error',
                autoClose: 5000,
                isLoading: false,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row mb-4 text-center">
                <h1 className="w-75 mx-auto fs-1">Añadir Equipo al Torneo</h1>
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
                        {tournament && teams.map((team) => {
                            console.log("team.game:", team.game);
                            console.log("data?.game:", tournament?.game);
                            return (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-75 mx-auto">
                    Añadir Equipo
                </button>
            </div>
        </form>
    );
}
