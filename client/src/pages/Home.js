import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <section className="hero">
      <div className="hero__bg"></div>
      <div className="container hero__content">
        <h1>Bienvenido a Game Paradise</h1>
        <p>
          El marketplace gaming más completo de México. Descubre los mejores juegos, 
          consolas y accesorios.
        </p>
        <div className="hero__cta">
          <Link to="/catalog" className="btn btn--primary">
            🎮 Explorar Catálogo
          </Link>
          {isAuthenticated && (
            <Link to="/profile" className="btn btn--ghost">
              👤 Mi Cuenta
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
export default Home;