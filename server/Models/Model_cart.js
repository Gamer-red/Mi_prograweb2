const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({ 
   game:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Games',
    required: true
   },
   quantity:{
    type: Number,
    required: true,
    default: 1,
    min: 1
   },
   price:{
    type:Number,
    required: true
   }
});

const cartShema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Cada usuario tiene un solo carrito
    },
    items: [cartItemSchema],
    total:{
        type:Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartShema);