const express = require('express');
const router = express.Router();
const Rating = require('../Models/Model_rating');
const Games = require('../Models/Model_games');

// POST /api/ratings - Crear o actualizar una calificación
router.post('/', async (req, res) => {
  try {
    const { Calificacion, games, user } = req.body;

    // Validar que la calificación esté entre 1 y 5
    if (Calificacion < 1 || Calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }

    // Verificar si el juego existe
    const gameExists = await Games.findById(games);
    if (!gameExists) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    // Buscar si ya existe una calificación del mismo usuario para el mismo juego
    const existingRating = await Rating.findOne({ games, user });

    if (existingRating) {
      // Actualizar calificación existente
      existingRating.Calificacion = Calificacion;
      const updatedRating = await existingRating.save();
      
      // Populate para devolver datos completos
      await updatedRating.populate('user', 'username');
      await updatedRating.populate('games', 'Nombre_juego');
      
      return res.json({
        message: 'Calificación actualizada',
        rating: updatedRating
      });
    } else {
      // Crear nueva calificación
      const newRating = new Rating({
        Calificacion,
        games,
        user
      });

      const savedRating = await newRating.save();
      
      // Populate para devolver datos completos
      await savedRating.populate('user', 'username');
      await savedRating.populate('games', 'Nombre_juego');

      res.status(201).json({
        message: 'Calificación creada',
        rating: savedRating
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/ratings - Obtener todas las calificaciones con filtros
router.get('/', async (req, res) => {
  try {
    const { games, user } = req.query;
    let filter = {};

    // Filtros opcionales
    if (games) filter.games = games;
    if (user) filter.user = user;

    const ratings = await Rating.find(filter)
      .populate('user', 'username email') // Datos del usuario
      .populate('games', 'Nombre_juego'); // Datos del juego

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
});

// GET /api/ratings/game/:gameId - Obtener calificaciones de un juego específico
router.get('/game/:gameId', async (req, res) => {
  try {
    const ratings = await Rating.find({ games: req.params.gameId })
      .populate('user', 'username')
      .populate('games', 'Nombre_juego');

    // Calcular promedio de calificaciones
    const averageRating = ratings.reduce((sum, rating) => sum + rating.Calificacion, 0) / ratings.length;

    res.json({
      ratings,
      average: averageRating || 0,
      total: ratings.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener calificaciones del juego' });
  }
});

module.exports = router;