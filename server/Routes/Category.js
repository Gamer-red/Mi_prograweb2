const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/categorycontroller');

router.get('/', categoryController.getCategories);

module.exports = router;