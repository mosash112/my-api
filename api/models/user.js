const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: { type: String, required: true },
    name: { type: String },
    admin: { type: Boolean, default: false },
    type: { type: String },
    orders: [{ orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } }],
})

module.exports = mongoose.model('User', userSchema)