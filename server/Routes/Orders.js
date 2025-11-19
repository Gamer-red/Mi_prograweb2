const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/vendor-sales', orderController.getVendorOrders);

module.exports = router;