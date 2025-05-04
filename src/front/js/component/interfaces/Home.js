import React from 'react';
import "../../../styles/home.css";

export default function HomeInterface() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>¡Bienvenido al sistema de torneos KuaiMisS!</h1>
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
        </div>
    );
}