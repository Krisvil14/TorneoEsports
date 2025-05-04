import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Container from './html/Container';
import Text from './html/Text';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import controlImageUrl from '../../img/control.png';
import '../../styles/navbar.css';

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate('/login', { replace: true });
  };

  return (
    <Container as="nav" className="gaming-navbar navbar navbar-expand-lg navbar-dark">
      <Container className="container-fluid">
        <div style={{ height: '56px', display: 'flex', alignItems: 'center' }}>
          <img src={controlImageUrl} className="gaming-logo" alt="Logo" />
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <Container className="collapse navbar-collapse" id="navbarNav">
          <Container className="navbar-nav justify-content-center w-100">
            {store.isAuthenticated && (
              <Container className="d-flex">
                {store.user && store.user.role === 'admin' ? (
                  <>
                    <Link to="/inicio" className="nav-item nav-link">
                      <Text>Inicio</Text>
                    </Link>
                    <Link to="/admin/teams" className="nav-item nav-link">
                      <Text>Equipos</Text>
                    </Link>
                    <Link to="/admin/users" className="nav-item nav-link">
                      <Text>Usuarios</Text>
                    </Link>
                    <Link to="/admin/tournaments" className="nav-item nav-link">
                      <Text>Torneos</Text>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/inicio" className="nav-item nav-link">
                      <Text>Inicio</Text>
                    </Link>
                    <Link to="/teams" className="nav-item nav-link">
                      <Text>Equipos</Text>
                    </Link>
                    <Link to="/profile" className="nav-item nav-link">
                      <Text>Perfil</Text>
                    </Link>
                    <Link to="/tournaments" className="nav-item nav-link">
                      <Text>Torneos</Text>
                    </Link>
                  </>
                )}
              </Container>
            )}
            {store.isAuthenticated && (
              <Container className="ms-auto">
                <button onClick={handleLogout} className="btn-logout">
                  <Text style={{ fontSize: '1.2rem', fontFamily: 'Impact, sans-serif', color: 'white' }}>Cerrar Sesión</Text>
                </button>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
