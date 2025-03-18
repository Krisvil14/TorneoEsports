import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Container from './html/Container';
import Text from './html/Text';
import { Context } from '../store/appContext';

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  const handleLogout = () => {
    actions.logout();
  };

  return (
    <Container as="nav" className="navbar navbar-light bg-light">
      <Container className="container">
        <Link to="/">
          <Text as="span" className="navbar-brand mb-0 h1">
            React Boilerplate
          </Text>
        </Link>
        <Container className="ml-auto">
          <Link to="/inicio">
            <button className="btn btn-primary">
              Inicio
            </button>
          </Link>
          <Link to="/demo">
            <button className="btn btn-primary ml-2">
              Check the Context in action
            </button>
          </Link>
          {store.isAuthenticated && (
            <button onClick={handleLogout} className="btn btn-danger ml-2">
              Cerrar Sesión
            </button>
          )}
        </Container>
      </Container>
    </Container>
  );
};