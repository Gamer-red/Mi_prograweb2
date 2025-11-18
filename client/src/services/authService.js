import axios from 'axios';

const API_URL = '/api/users';

const authService = {
  // Registrar usuario - CONECTADO A TU BACKEND
  register: async (userData) => {
    try {
      // Mapear los datos del frontend al formato del backend
      const backendData = {
        Nombre_usuario: userData.nombre_usuario,
        Correo: userData.correo,
        Contrasenia: userData.contrasenia,
        Sexo: userData.sexo,
        Rol: userData.tipo_usuario, // "cliente" o "vendedor" en tu frontend
        Telefono: userData.telefono
      };

      const response = await axios.post(`${API_URL}/register`, backendData);
      
      // ✅ DEVOLVER USUARIO Y TOKEN (si el backend los proporciona)
      return {
        user: response.data.user,
        token: response.data.token // ✅ Agregar token si existe
      };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en el registro');
    }
  },

  // Login de usuario - CONECTADO A TU BACKEND
  login: async (email, password) => {
    try {
      console.log('authService.login recibió:', { email, password });
      const backendCredentials = {
        Correo: email,
        Contrasenia: password 
      };
      console.log('Enviando al backend:', backendCredentials);
      const response = await axios.post(`${API_URL}/login`, backendCredentials);
      console.log('Respuesta del backend:', response.data);
      
      // ✅ DEVOLVER USUARIO Y TOKEN
      return {
        user: response.data.user,
        token: response.data.token // ✅ Agregar token
      };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Error en el login');
    }
  }
};

export default authService;