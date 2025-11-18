// context/GameContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { gameService } from '../services/gameService';

const GameContext = createContext();

export const useGames = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGames debe ser usado dentro de un GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar juegos desde la API real
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando juegos desde API...');
      const response = await gameService.getGames();
      console.log('📦 Respuesta de la API:', response);
      console.log('🎮 Juegos recibidos:', response.games);
      
      if (response.success) {
        console.log('✅ Datos crudos del backend:', response.games);
        
        // MAPEO CORREGIDO
        const formattedGames = response.games.map(game => {
          console.log('🔍 Procesando juego:', game.Nombre_juego);
          
          return {
            _id: game._id,
            nombre_juego: game.Nombre_juego,
            cantidad: game.Cantidad,
            precio: game.Precio,
            informacion: game.Informacion,
            vendedor: game.Vendedor?.Nombre_usuario || 'Vendedor no disponible',
            company: game.compania?.Nombre_Compania || 'Compañía no especificada',
            categories: game.categoria ? [game.categoria.name] : [],
            platform: game.plataforma?.Nombre_Plataforma || 'Plataforma no especificada',
            image: game.imagenes && game.imagenes.length > 0 && game.imagenes[0].filename
              ? `http://localhost:3000/uploads/${game.imagenes[0].filename}`
              : 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Imagen+No+Disponible',
            badge: null,
            rating: 0,
            precioOriginal: null,
            releaseDate: game.createdAt || new Date().toISOString()
          };
        });

        console.log('🎯 Juegos formateados:', formattedGames);
        console.log('📊 Total de juegos:', formattedGames.length);
        
        setGames(formattedGames);
        setFilteredGames(formattedGames);
      } else {
        setError('Error al cargar los juegos desde el servidor');
      }
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Error de conexión con el servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let results = games;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      results = results.filter(game =>
        game.nombre_juego.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.platform && game.platform.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrar por plataforma
    if (selectedPlatform !== 'all') {
      results = results.filter(game => game.platform === selectedPlatform);
    }
    
    setFilteredGames(results);
  }, [searchTerm, selectedPlatform, games]);

  const searchGames = (term) => {
    setSearchTerm(term);
  };

  const filterByPlatform = (platform) => {
    setSelectedPlatform(platform);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlatform('all');
  };

  const refreshGames = () => {
    loadGames();
  };

  const value = {
    games: filteredGames,
    allGames: games,
    loading,
    error,
    searchGames,
    filterByPlatform,
    clearFilters,
    refreshGames,
    searchTerm,
    selectedPlatform
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};