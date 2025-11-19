const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({ 
    calificacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }
}, {
    timestamps: true
});

// Índice compuesto para evitar reviews duplicadas
reviewSchema.index({ game: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);