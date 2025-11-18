const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
    Nombre_usuario: {
        type: String,  // ✅ AGREGAR
        required: true,  // ✅ CORREGIR: required no require
        unique: true
    },
    Correo: {
        type: String,
        required: true,  // ✅ CORREGIR
        unique: true
    },
    Contrasenia: {
        type: String,
        required: true
    },
    Sexo: {
        type: String,
        required: true  // ✅ CORREGIR
    },
    Rol: {
        type: String,
        required: true  // ✅ CORREGIR
    },
    Telefono: {
        type: String,
        required: true  // ✅ CORREGIR
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    juegosPublicados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games'
    }],
    Comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    Rating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    Order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
}, {
    timestamps: true  // Agregar createdAt y updatedAt automáticamente
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);