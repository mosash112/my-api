const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    products: [{productId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }}],
    totalPrice:{type:Number, required:true}
})

module.exports = mongoose.model('Order', orderSchema)