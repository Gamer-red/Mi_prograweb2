const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Definir rutas y asignar controllers
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);        // Obtener todos los usuarios
router.get('/:id', userController.getUserById);     // Obtener usuario por ID
router.put('/:id', userController.updateUser);      // Actualizar usuario
router.delete('/:id', userController.deleteUser);   // Eliminar usuario

module.exports = router;