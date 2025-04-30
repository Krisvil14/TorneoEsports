import React from 'react';
import "../../../styles/home.css";

export default function HomeInterface() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>¡Bienvenido al Mundo de los Torneos Gaming!</h1>
                    <p>Compite, Conquista, Conviértete en Leyenda</p>
                    <button className="cta-button">Explorar Torneos</button>
                </div>
            </section>

            {/* Featured Sections */}
            <div className="features-grid">
                <div className="feature-card">
                    <i className="fas fa-trophy"></i>
                    <h3>Torneos Activos</h3>
                    <p>Únete a los torneos más emocionantes del momento</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-users"></i>
                    <h3>Equipos Destacados</h3>
                    <p>Conoce a los mejores equipos de la comunidad</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-gamepad"></i>
                    <h3>Juegos Populares</h3>
                    <p>Descubre los títulos más jugados</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-chart-line"></i>
                    <h3>Rankings</h3>
                    <p>Comprueba tu posición en la clasificación</p>
                </div>
            </div>

            {/* Latest Tournaments Section */}
            <section className="latest-tournaments">
                <h2>Próximos Torneos</h2>
                <div className="tournaments-grid">
                    <div className="tournament-card">
                        <div className="tournament-image"></div>
                        <h4>Torneo League of Legends</h4>
                        <p>Premio: $1000</p>
                        <span className="date">Próximamente</span>
                    </div>
                    <div className="tournament-card">
                        <div className="tournament-image"></div>
                        <h4>Torneo Valorant</h4>
                        <p>Premio: $800</p>
                        <span className="date">Próximamente</span>
                    </div>
                    <div className="tournament-card">
                        <div className="tournament-image"></div>
                        <h4>Torneo CS:GO</h4>
                        <p>Premio: $1200</p>
                        <span className="date">Próximamente</span>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="community-section">
                <h2>Únete a Nuestra Comunidad Gaming</h2>
                <p>Conecta con otros jugadores, forma tu equipo y participa en torneos emocionantes</p>
                <div className="community-stats">
                    <div className="stat">
                        <h3>1000+</h3>
                        <p>Jugadores</p>
                    </div>
                    <div className="stat">
                        <h3>50+</h3>
                        <p>Torneos</p>
                    </div>
                    <div className="stat">
                        <h3>100+</h3>
                        <p>Equipos</p>
                    </div>
                </div>
            </section>
        </div>
    );
}