const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
  type: String},
  games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games'
    }]
});

module.exports = mongoose.model('Category', categorySchema);