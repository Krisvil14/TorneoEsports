import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Context } from '../../../store/appContext';

export default function ProfileInterface() {
    const { store } = useContext(Context);
    const user = store.user;

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="container text-center">
            <h1 className="my-4">Información Personal</h1>
            <div className="row">
                <div className="col">
                    <p><strong>Nombre:</strong> {user.first_name}</p>
                    <p><strong>Apellido:</strong> {user.last_name}</p>
                    <p><strong>Cédula:</strong> {user.cedula}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>En Equipo:</strong> {user.is_in_team ? '✔' : 'X'}</p>
                    <p><strong>Equipo asignado:</strong> {user.team_name}</p>
                </div>
            </div>
            <Link to="/edit-profile" className="btn btn-primary">Editar</Link>
        </div>
    );
}
