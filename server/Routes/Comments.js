const express = require('express');
const router = express.Router();
const Comments = require('../Models/Model_comments');
const Games = require('../Models/Model_games');
const User = require('../Models/Model_user');

// POST /api/comments - Crear un nuevo comentario
router.post('/', async (req, res) => {
  try {
    const { Comentario, games, user } = req.body;

    // Validar que el comentario no esté vacío
    if (!Comentario || Comentario.trim().length === 0) {
      return res.status(400).json({ error: 'El comentario no puede estar vacío' });
    }

    if (Comentario.length > 500) {
      return res.status(400).json({ error: 'El comentario no puede exceder 500 caracteres' });
    }

    // Verificar si el juego existe
    const gameExists = await Games.findById(games);
    if (!gameExists) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    // Verificar si el usuario existe
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear nuevo comentario
    const newComment = new Comments({
      Comentario: Comentario.trim(),
      games,
      user
    });

    const savedComment = await newComment.save();
    
    // Populate para devolver datos completos
    await savedComment.populate('user', 'username avatar');
    await savedComment.populate('games', 'Nombre_juego');

    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comment: savedComment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// GET /api/comments/game/:gameId - Obtener comentarios de un juego específico
router.get('/game/:gameId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'user',
        select: 'username avatar createdAt'
      }
    };

    const comments = await Comments.paginate(
      { games: req.params.gameId },
      options
    );

    res.json({
      comments: comments.docs,
      total: comments.totalDocs,
      pages: comments.totalPages,
      currentPage: comments.page
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios del juego' });
  }
});
module.exports = router;