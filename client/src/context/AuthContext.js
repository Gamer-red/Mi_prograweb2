import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

// ✅ useAuth hook - exportado individualmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// ✅ AuthProvider - exportado por defecto
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ✅ LOGIN - Guardar token y usuario
  const login = async (email, password) => {
    try {
      console.log('AuthContext.login recibió:', { email, password });
      const response = await authService.login(email, password);
      
      // ✅ GUARDAR TOKEN Y USUARIO
      setCurrentUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Error en AuthContext.login:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ REGISTER - Guardar token y usuario
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // ✅ GUARDAR TOKEN Y USUARIO
      setCurrentUser(response.user);
      setToken(response.token);
      
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateCurrentUser = (updatedUserData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    
    // Actualizar también en localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    localStorage.setItem('currentUser', JSON.stringify({
      ...storedUser,
      ...updatedUserData
    }));
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const value = {
    currentUser,
    token,
    login,
    register,
    logout,
    updateCurrentUser,
    isAuthenticated: !!currentUser && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ SOLO UNA EXPORTACIÓN POR DEFECTO - elimina la línea duplicada
export default AuthProvider;