import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../../../styles/gaming.css';

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


                // Fetch teams after tournament data is loaded
                const fetchTeams = async () => {
                    let teamData; // Declare teamData outside the try block
                    try {
                        const response = await fetch(process.env.BACKEND_URL + `/api/teams`);
                        let teamData;
                        teamData = await response.json();
                        const filteredTeams = teamData.filter(team => team.game === data?.game);
                        setTeams(filteredTeams);
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
            const response = await fetch(process.env.BACKEND_URL + `/api/admin/tournaments/${tournament_id}/teams`, {
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
                navigate(`/admin/tournaments`);
            } else {
                if (json.error === "Elija un equipo que no este registrado en este torneo") {
                    toast.update(notification, {
                        render: 'El equipo ya está en este torneo',
                        type: 'error',
                        autoClose: 5000,
                        isLoading: false,
                    });
                } else {
                    toast.update(notification, {
                        render: 'Error al añadir el equipo al torneo',
                        type: 'error',
                        autoClose: 5000,
                        isLoading: false,
                    });
                }
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
        <div className="gaming-container">
            <div className="gaming-card">
                <div className="gaming-header">
                    <h1 className="gaming-title">Añadir Equipo al Torneo</h1>
                </div>
                <form onSubmit={handleSubmit} className="gaming-form">
                    <div className="gaming-form-group">
                        <label htmlFor="team" className="gaming-label">Equipo:</label>
                        <select
                            id="team"
                            name="team"
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            required
                            className="gaming-select"
                        >
                            <option value="">Seleccione un equipo</option>
                            {tournament && teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="gaming-button-group">
                        <button type="submit" className="gaming-button gaming-button-primary">
                            Añadir equipo al torneo
                        </button>
                        <Link to="/admin/tournaments" className="gaming-button gaming-button-secondary">
                            Volver
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
