const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    Nombre_Compania:{
        type: String,
        required: true,
        unique: true
    },
        games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games'
    }]
});
module.exports = mongoose.model('Company', companySchema);