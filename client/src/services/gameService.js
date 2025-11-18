// services/gameService.js
const API_URL = 'http://localhost:3000/api'; // Puerto 3000 (tu servidor Express)

export const gameService = {
  getGames: async () => {
    try {
      const response = await fetch('/api/games'); // Ruta relativa
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },
  getGameById: async (id) => {
    try {
      const response = await fetch(`/api/games/${id}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching game:', error);
      throw error;
    }
  }
  
};