const mongoose = require('mongoose');
const { type } = require('os');

const OrderScehma = new mongoose.Schema({
    email :{
        type:String,
        required : true,
        unique : true
    },
    order_data :{
        type : Array,
        required:true
    },
});

const Order = mongoose.model('Order', OrderScehma);

module.exports = Order;
