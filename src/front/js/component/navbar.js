import React, { useContext, useEffect, useState } from 'react';
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
  const [teamInfo, setTeamInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (store.user && store.user.team_id) {
        try {
          const response = await fetch(process.env.BACKEND_URL + `/api/teams/${store.user.team_id}`);
          if (response.ok) {
            const data = await response.json();
            setTeamInfo(data);
          }
        } catch (error) {
          console.error('Error fetching team info:', error);
        }
      } else {
        setTeamInfo(null);
      }
    };

    fetchTeamInfo();
  }, [store.user]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    actions.logout();
    navigate('/', { replace: true });
    setMenuOpen(false);
  };

  const handleNavClick = () => setMenuOpen(false);

  // Logo para usar en overlay móvil
  const Logo = (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
      <img src={controlImageUrl} className="gaming-logo" alt="Logo" />
    </div>
  );

  return (
    <Container as="nav" className="gaming-navbar navbar navbar-expand-lg navbar-dark">
      <Container className="container-fluid">
        {/* Logo solo visible en escritorio */}
        <div className="d-none d-lg-flex" style={{ height: '56px', alignItems: 'center' }}>
          <img src={controlImageUrl} className="gaming-logo" alt="Logo" />
        </div>
        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Overlay del menú en móvil */}
        <Container
          className={`collapse navbar-collapse${menuOpen ? ' show-navbar-overlay' : ''}`}
          id="navbarNav"
          style={menuOpen ? { display: 'flex' } : {}}
        >
          {/* Botón de cerrar solo visible en móvil y cuando el menú está abierto */}
          {menuOpen && (
            <button className="navbar-close-btn" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
              &times;
            </button>
          )}
          {/* Logo visible solo en móvil dentro del overlay */}
          {menuOpen && (
            <div className="d-lg-none" style={{ width: '100%' }}>
              {Logo}
            </div>
          )}
          <Container className="navbar-nav justify-content-center w-100">
            {store.isAuthenticated && (
              <Container className="d-flex flex-column flex-lg-row w-100 align-items-center">
                {store.user && store.user.role === 'admin' ? (
                  <>
                    <Link to="/inicio" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Inicio</Text>
                    </Link>
                    <Link to="/admin/teams" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Equipos</Text>
                    </Link>
                    <Link to="/admin/users" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Usuarios</Text>
                    </Link>
                    <Link to="/admin/tournaments" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Torneos</Text>
                    </Link>
                    <Link to="/admin/payments" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Pagos</Text>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/inicio" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Inicio</Text>
                    </Link>
                    <Link to="/teams" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Equipos</Text>
                    </Link>
                    <Link to="/profile" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Perfil</Text>
                    </Link>
                    <Link to="/tournaments" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Torneos</Text>
                    </Link>
                    <Link to="/ranking" className="nav-item nav-link" onClick={handleNavClick}>
                      <Text>Ranking</Text>
                    </Link>
                    {store.user && (store.user.is_leader || store.user.role === 'admin') && (
                      <Link to="/payments" className="nav-item nav-link" onClick={handleNavClick}>
                        <Text>Pagos</Text>
                      </Link>
                    )}
                  </>
                )}
              </Container>
            )}
            {/* Acciones: balance y cerrar sesión, alineados a la derecha en escritorio y al final en móvil */}
            {store.isAuthenticated && (
              <Container className="navbar-actions ms-auto d-flex align-items-center flex-column flex-lg-row w-100 w-lg-auto">
                {store.user && store.user.team_id && teamInfo && (
                  <div className="team-balance me-3">
                    <div className="balance-content">
                      <span className="balance-icon">💰</span>
                      <div className="balance-text">
                        <span className="team-name">{teamInfo.name}</span>
                        <span className="balance-amount">${teamInfo.balance}</span>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
