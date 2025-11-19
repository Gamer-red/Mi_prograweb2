const mongoose = require('mongoose');
const Games = require('../Models/Model_games');
const Media = require('../Models/Model_media');

// Crear juego - FUNCIÓN SIMPLE
const createGame = async (req, res) => {
  try {
    console.log('🎮 Creando juego...');
    console.log('📝 Datos recibidos:', req.body);
    console.log('📸 Archivos recibidos:', req.files ? req.files.length : 0);
    console.log('🔍 Usuario del middleware:', req.user); // ✅ Verificar esto

    const {
      nombre, cantidad, precio, informacion, plataforma, categoria, compania
    } = req.body;

    // 1. Crear el juego en la base de datos
    const nuevoJuego = new Games({
      Nombre_juego: nombre,
      Cantidad: parseInt(cantidad),
      Precio: parseFloat(precio),
      Informacion: informacion,
      plataforma: plataforma,
      categoria: categoria,
      compania: compania || null,
      Vendedor: req.user._id, // Del middleware auth
      imagenes: [] // Se llenará después
    });

    const juegoGuardado = await nuevoJuego.save();
    console.log('✅ Juego guardado en BD:', juegoGuardado._id);

    // 2. Crear registros en Media para cada imagen
    if (req.files && req.files.length > 0) {
      const mediaPromises = req.files.map(async (file) => {
        const nuevoMedia = new Media({
          filename: file.filename,
          juego: juegoGuardado._id
        });
        return await nuevoMedia.save();
      });

      const mediaCreado = await Promise.all(mediaPromises);
      console.log('✅ Medias creados:', mediaCreado.length);

      // 3. Actualizar el juego con las referencias a las imágenes
      juegoGuardado.imagenes = mediaCreado.map(media => media._id);
      await juegoGuardado.save();
    }

    // 4. Respuesta exitosa
    res.json({
      success: true,
      message: '🎉 ¡Juego creado exitosamente y guardado en la base de datos!',
      game: {
        id: juegoGuardado._id,
        nombre: juegoGuardado.Nombre_juego,
        precio: juegoGuardado.Precio,
        cantidad: juegoGuardado.Cantidad,
        imagenes: juegoGuardado.imagenes.length,
        fecha: juegoGuardado.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error en createGame:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener todos los juegos - FUNCIÓN SIMPLE
const getAllGames = async (req, res) => {
  try {
    const games = await Games.find({ activo: true })
      .populate('plataforma', 'Nombre_Plataforma') // ✅ Campo correcto
      .populate('categoria', 'name') // ✅ Campo correcto  
      .populate('compania', 'Nombre_Compania') // ✅ Campo correcto
      .populate('imagenes', 'filename') // ✅ Campo correcto
      .populate('Vendedor', 'Nombre_usuario Correo'); // ✅ Campos correctos

    res.json({
      success: true,
      count: games.length,
      games
    });
  } catch (error) {
    console.error('❌ Error en getAllGames:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener juegos'
    });
  }
};

const getGameById = async (req, res) => {
  try {
    const game = await Games.findById(req.params.id)
      .populate('plataforma', 'Nombre_Plataforma') // ✅ AGREGAR ESTA LÍNEA
      .populate('categoria', 'name')
      .populate('compania', 'Nombre_Compania')
      .populate('imagenes', 'filename')
      .populate('Vendedor', 'Nombre_usuario');
      console.log('🔍 BACKEND - Juego ID:', game._id);
      console.log('🔍 BACKEND - Vendedor raw:', game.Vendedor);
      console.log('🔍 BACKEND - Vendedor tipo:', typeof game.Vendedor);
      console.log('🔍 BACKEND - Vendedor es ObjectId?:', game.Vendedor instanceof mongoose.Types.ObjectId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Juego no encontrado'
      });
    }

    res.json({
      success: true,
      game
    });
  } catch (error) {
    console.error('❌ Error en getGameById:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el juego'
    });
  }
};

// Exportar
module.exports = {
  createGame,
  getAllGames,
  getGameById
};