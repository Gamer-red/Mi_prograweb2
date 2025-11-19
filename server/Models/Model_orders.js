const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games',
        required: true
    },
    nombreJuego: {
        type: String,
        required: true
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precio: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    metodoPago: {
        type: String,
        required: true,
        enum: ['tarjeta', 'transferencia']
    }
});

module.exports = mongoose.model('Order', OrderSchema);