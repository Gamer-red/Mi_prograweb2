const express = require('express');
const router = express.Router();
const gameController = require('../Controllers/gamecontroller');
const { uploadMultiple } = require('../middleware/upload');
const auth = require('../middleware/auth');

// RUTAS SIMPLES
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById); 
router.post('/', auth, uploadMultiple, gameController.createGame);

module.exports = router;