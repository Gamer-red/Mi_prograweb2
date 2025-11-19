import React from 'react';
import GameFilters from '../components/games/GameFilters';
import GameGrid from '../components/games/GameGrid';
import { useGames } from '../context/GameContext';

const Catalog = () => {
  const { games } = useGames();

  return (
    <section className="section container">
      <div className="section__head">
        <h2>Catálogo de Productos</h2>
        <p>Encuentra los mejores títulos clasificados por plataforma y con reseñas de la comunidad</p>
      </div>
      
      <GameFilters />
      
      <div className="game-count">
        {games.length} {games.length === 1 ? 'juego encontrado' : 'juegos encontrados'}
      </div>

      <GameGrid />
    </section>
  );
};

export default Catalog;