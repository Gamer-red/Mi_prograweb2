import React from 'react';
import { useGames } from '../../context/GameContext';
import GameCard from './GameCard';

const GameGrid = () => {
  const { games, loading } = useGames();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando juegos...</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="no-results">
        <h3>No se encontraron juegos</h3>
        <p>Intenta con otros filtros o términos de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {games.map(game => (
        <GameCard key={game._id} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;