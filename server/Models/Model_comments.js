const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({ 
        Comentario:{
        type: String,
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

module.exports = mongoose.model('Comments', commentSchema);