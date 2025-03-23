import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Container from './html/Container';
import Text from './html/Text';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import controlImageUrl from '../../img/control.png';

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate('/login', { replace: true });
  };

  return (
    <Container as="nav" className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'purple' }}>
      <Container className="container-fluid">
        <div style={{ height: '56px', display: 'flex', alignItems: 'center' }}>
          <img src={controlImageUrl} style={{ height: '100%' }} />
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <Container className="collapse navbar-collapse" id="navbarNav">
          <Container className="navbar-nav justify-content-center w-100">
            {store.isAuthenticated && (
              <Container className="d-flex">
                <Link to="/inicio" className="nav-item nav-link" style={{ marginRight: '10px' }}>
                  <Text style={{ fontSize: '1.2rem', fontFamily: 'Impact, sans-serif', color:'' }}>Inicio</Text>
                </Link>
                <Link to="/teams" className="nav-item nav-link" style={{ marginRight: '10px' }}>
                  <Text style={{ fontSize: '1.2rem', fontFamily: 'Impact, sans-serif',color:'' }}>Equipos</Text>
                </Link>
                <Link to="/users" className="nav-item nav-link" style={{ marginRight: '10px' }}>
                  <Text style={{ fontSize: '1.2rem', fontFamily: 'Impact, sans-serif',color:'' }}>Usuarios</Text>
                </Link>
                <Link to="/tournaments" className="nav-item nav-link" style={{ marginRight: '10px' }}>
                  <Text style={{ fontSize: '1.2rem', fontFamily: 'Impact, sans-serif',color:'' }}>Torneos</Text>
                </Link>
              </Container>
            )}
            {store.isAuthenticated && (
              <Container className="ms-auto">
                <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '10px' }}>
                <Text style={{ fontSize: '1.2rem', fontFamily: 'Impact, sans-serif',color:'white' }}>Cerrar Sesión</Text>
                </button>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
