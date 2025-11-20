import React from 'react';
import { useGames } from '../../context/GameContext';

const GameFilters = () => {
  const { searchGames, filterByPlatform, clearFilters, searchTerm, selectedPlatform } = useGames();

  const platforms = [
    { value: 'all', label: 'Todos' },
    { value: 'Nintendo', label: 'Nintendo ' },
    { value: 'PlayStation', label: 'PlayStation ' },
    { value: 'Xbox', label: 'Xbox ' },
    { value: 'PC', label: 'PC' }
  ];

  return (
    <div className="filters-section">
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar juegos, consolas, accesorios..."
          value={searchTerm}
          onChange={(e) => searchGames(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters">
        {platforms.map(platform => (
          <button
            key={platform.value}
            className={`filter-btn ${selectedPlatform === platform.value ? 'active' : ''}`}
            onClick={() => filterByPlatform(platform.value)}
          >
            {platform.label}
          </button>
        ))}
        
        {(searchTerm || selectedPlatform !== 'all') && (
          <button className="filter-btn" onClick={clearFilters}>
            ✕ Limpiar
          </button>
        )}
      </div>
    </div>
  );
};

export default GameFilters;