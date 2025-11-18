// middleware/auth.js - VERSIÓN CORREGIDA
const jwt = require('jsonwebtoken');
const User = require('../Models/Model_user'); // ✅ Importar modelo User

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔐 Middleware auth - Token recibido:', token ? '✅ Sí' : '❌ No');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Acceso denegado. No hay token.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('🔐 User decoded del token:', decoded);
    
    // ✅ BUSCAR USUARIO COMPLETO EN LA BASE DE DATOS
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Usuario no encontrado.' 
      });
    }

    req.user = user; // ✅ Asignar el usuario completo de la BD
    
    console.log('🔐 Middleware auth - ACCESO PERMITIDO para user:', user.Nombre_usuario);
    
    next();
  } catch (error) {
    console.error('🔐 Middleware auth - ERROR:', error.message);
    res.status(401).json({ 
      success: false,
      error: 'Token inválido o expirado.' 
    });
  }
};

module.exports = auth;