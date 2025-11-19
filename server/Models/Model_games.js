const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Model_comments = require('./Model_comments');
const gameSchema = new mongoose.Schema({
    Nombre_juego: {
        type: String,
        required: true,
        trim: true
    },
    Cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    Precio: {
        type: Number,
        required: true,
        min: 0
    },
    Informacion: {
        type: String,
        required: true
    },
    // ✅ CAMBIADO: Hacer Vendedor opcional temporalmente
    Vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  // ❌ COMENTADO TEMPORALMENTE
    },
    // ✅ CORREGIDO: compania no company
    compania: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
        // required: true  // ❌ COMENTADO TEMPORALMENTE
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    plataforma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plataform',
        required: true
    },
    imagenes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Games', gameSchema);