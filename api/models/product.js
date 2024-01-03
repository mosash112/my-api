const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, required: true },
    stock: { type: Number },
    image: { type: String },
    rate: { type: Number },
    count: { type: Number }
})

module.exports = mongoose.model('Product', productSchema)