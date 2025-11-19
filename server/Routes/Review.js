const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Crear review
router.post('/', reviewController.createReview);

// Obtener reviews de un juego (pública)
router.get('/game/:gameId', reviewController.getGameReviews);

// Obtener reviews del usuario
router.get('/my-reviews', reviewController.getUserReviews);

// Actualizar review
router.put('/:reviewId', reviewController.updateReview);

// Eliminar review
router.delete('/:reviewId', reviewController.deleteReview);

router.get('/user-game/:gameId', reviewController.getUserGameReview);

module.exports = router;