const API_URL = '/api/orders';

export const orderService = {
  createOrder: async (metodoPago) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ metodoPago })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener las órdenes');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  getVendorOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/vendor-sales`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener las ventas');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      throw error;
    }
  }
};