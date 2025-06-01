import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing.css';

export default function Landing  () {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">¡Bienvenido al sistema de torneos KuaiMisS!</h1>
        <p className="landing-subtitle">¡Únete a la competencia y demuestra tu destreza!</p>
        
        <div className="landing-buttons">
          <Link to="/login" className="landing-button login-button">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="landing-button register-button">
            Registrarse
          </Link>
        </div>

        <div className="landing-features">
          <div className="feature">
            <i className="fas fa-trophy"></i>
            <h3>Torneos Competitivos</h3>
            <p>Participa en torneos de los mejores juegos</p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <h3>Equipos</h3>
            <p>Forma tu equipo y compite junto a tus amigos</p>
          </div>
          <div className="feature">
            <i className="fas fa-coins"></i>
            <h3>Premios</h3>
            <p>Gana premios y reconoce tu talento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

