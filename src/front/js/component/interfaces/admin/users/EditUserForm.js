import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../../../../styles/users.css";

export default function EditUserForm() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        cedula: '',
        age: '',
        role: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setFormData({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        cedula: data.cedula,
                        age: data.age,
                        role: data.role
                    });
                } else {
                    toast.error('Error al cargar los datos del usuario');
                }
            } catch (error) {
                toast.error('Error al cargar los datos del usuario');
            }
        };
        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.first_name || !formData.last_name || !formData.cedula || !formData.age || !formData.role) {
            toast.error('Todos los campos son obligatorios');
            return false;
        }

        if (!/^\d+$/.test(formData.cedula)) {
            toast.error('La cédula debe contener solo números');
            return false;
        }

        const age = parseInt(formData.age);
        if (isNaN(age) || age <= 0) {
            toast.error('La edad debe ser un número positivo');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/admin/users');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Error al actualizar el usuario');
            }
        } catch (error) {
            toast.error('Error al actualizar el usuario');
        }
    };

    if (!user) {
        return <div className="loading">Cargando</div>;
    }

    return (
        <div className="users-container">
            <section className="users-hero">
                <h1>Editar Usuario</h1>
            </section>
            <div className="users-content">
                <div className="users-filters" style={{maxWidth: 520, margin: '0 auto'}}>
                    <div className="filters-header">
                        <h2 style={{color: '#00fff7'}}>Formulario de Edición</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="gaming-form">
                        <div className="filter-group">
                            <label htmlFor="first_name">Nombre:</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese el nombre"
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="last_name">Apellido:</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese el apellido"
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="cedula">Cédula:</label>
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese la cédula"
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="age">Edad:</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ingrese la edad"
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="role">Rol:</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="">Seleccione un rol</option>
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div className="button-group" style={{justifyContent: 'center', marginTop: 24}}>
                            <button type="submit" className="gaming-button primary">
                                Guardar Cambios
                            </button>
                            <button 
                                type="button" 
                                className="gaming-button secondary reset-button"
                                onClick={() => navigate('/admin/users')}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 