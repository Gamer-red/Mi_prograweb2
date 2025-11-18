const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({ 
        Calificacion:{
        type: Number,
        required: true
    },
    games: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Games'
        },
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }  
});
module.exports = mongoose.model('Rating', ratingSchema);