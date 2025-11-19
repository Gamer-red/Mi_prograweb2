// Routes/Cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');
const auth = require('../middleware/auth');

// ✅ Todas las rutas protegidas con auth
router.use(auth);

// GET /api/cart - Obtener carrito del usuario autenticado
router.get('/', cartController.getCart);

// POST /api/cart/add - Agregar juego al carrito
router.post('/add', cartController.addToCart);

// PUT /api/cart/update - Actualizar cantidad de un item
router.put('/update', cartController.updateCartItem);

// DELETE /api/cart/remove - Remover item del carrito
router.delete('/remove', cartController.removeFromCart);

// DELETE /api/cart/clear - Vaciar el carrito
router.delete('/clear', cartController.clearCart);

module.exports = router;