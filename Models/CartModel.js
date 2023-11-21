const mongoose = require('mongoose');

const CartModel = new mongoose.Schema(
    {
        productId:{
            type:Number,
            required:true
        },
        userId:{
            type:String,
            required:true,
            ref:'User'
        },
        quantity:{
            type:Number,
            required:true
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Cart', CartModel);