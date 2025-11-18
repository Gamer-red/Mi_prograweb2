const User = require('../Models/Model_user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ Usar bcryptjs

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { Nombre_usuario, Correo, Contrasenia, Sexo, Rol, Telefono } = req.body;

    console.log('📝 Datos recibidos para registro:', { Nombre_usuario, Correo, Sexo, Rol, Telefono });

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      $or: [{ Correo }, { Nombre_usuario }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El correo o nombre de usuario ya está registrado'
      });
    }

    // ✅ HASHEAR LA CONTRASEÑA ANTES DE GUARDAR
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Contrasenia, saltRounds);

    // Crear nuevo usuario con contraseña hasheada
    const user = new User({
      Nombre_usuario,
      Correo,
      Contrasenia: hashedPassword, // ✅ Guardar contraseña hasheada
      Sexo,
      Rol,
      Telefono
    });

    const savedUser = await user.save();
    
    console.log('✅ Usuario registrado exitosamente:', savedUser.Nombre_usuario);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: savedUser._id,
        Nombre_usuario: savedUser.Nombre_usuario,
        Correo: savedUser.Correo,
        Rol: savedUser.Rol,
        Sexo: savedUser.Sexo,
        Telefono: savedUser.Telefono
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(400).json({
      success: false,
      error: 'Error al registrar usuario',
      details: error.message
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { Correo, Contrasenia } = req.body;

    console.log('Datos recibidos para login:', { Correo, Contrasenia });
    
    // Buscar usuario por correo
    const user = await User.findOne({ Correo });
    if (!user) {
       console.log('Usuario no encontrado:', Correo);
      return res.status(401).json({
        success: false,
        error: 'Credenciales incorrectas'
      });
    }

    console.log('Usuario encontrado:', user.Nombre_usuario);

    
    // Verificar contraseña (sin encriptación por ahora)
    const isMatch = await bcrypt.compare(Contrasenia, user.Contrasenia);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.Correo,
        role: user.Rol 
      }, 
      process.env.JWT_SECRET, // ✅ Usando variable de entorno
      { expiresIn: '24h' }
    );
    
    console.log('Login exitoso para:', user.Nombre_usuario);
    console.log('✅ Token generado para usuario:', user.Nombre_usuario);
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        Nombre_usuario: user.Nombre_usuario,
        Correo: user.Correo,
        Rol: user.Rol,
        Sexo: user.Sexo,
        Telefono: user.Telefono
      },
       token: token
    });
  } catch (error) {
     console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
      details: error.message
    });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al actualizar usuario',
      details: error.message
    });
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message
    });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      user: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario',
      details: error.message
    });
  }
};

// Exportar todos los métodos
module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser
};