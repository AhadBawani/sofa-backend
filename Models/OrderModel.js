const mongoose = require('mongoose');

const OrderModel = new mongoose.Schema(
    {
        orderId:{
            type:Number,
        },
        productId: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true,
            ref: 'User'
        },
        quantity:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        landMark:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        postalCode:{
            type:String,
            required:true
        },
        delivered:{
            type:Boolean,            
        },
        deleteOrder:{
            type:Boolean
        },
        orderInvoice:{
            type:String            
        }
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Order', OrderModel);