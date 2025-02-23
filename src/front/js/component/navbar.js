import React from 'react';
import { Link } from 'react-router-dom';
import Container from './html/Container';
import Text from './html/Text';

export const Navbar = () => {
  return (
    <Container as="nav" className="navbar navbar-light bg-light">
      <Container className="container">
        <Link to="/">
          <Text as="span" className="navbar-brand mb-0 h1">
            React Boilerplate
          </Text>
        </Link>
        <Container className="ml-auto">
          <Link to="/demo">
            <button className="btn btn-primary">
              Check the Context in action
            </button>
          </Link>
        </Container>
      </Container>
    </Container>
  );
};
