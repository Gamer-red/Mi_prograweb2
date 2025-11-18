// services/cartService.js
const API_URL = '/api/cart';

export const cartService = {
  getCart: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el carrito');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  addToCart: async (gameId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId, quantity })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar al carrito');
      }
      
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  updateQuantity: async (gameId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId, quantity })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar cantidad');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  removeFromCart: async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/remove`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al remover del carrito');
      }
      
      return data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al vaciar carrito');
      }
      
      return data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};