const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  // Solo guardamos el nombre del archivo y la referencia al juego
  filename: {
    type: String,
    required: true
  },
  // Referencia al juego al que pertenece esta imagen
  juego: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Games',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Media', mediaSchema);