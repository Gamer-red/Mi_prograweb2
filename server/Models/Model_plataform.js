const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const PlataformSchema = new mongoose.Schema({
    Nombre_Plataforma:{
        type: String,
        required: true,
        unique: true
    },
        games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games'
    }]
});
module.exports = mongoose.model('Plataform', PlataformSchema);