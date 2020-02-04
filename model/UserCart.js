const mongoose = require('mongoose')

const userCartSchema = new mongoose.Schema({
    body: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const UserCart = mongoose.model('UserCart', userCartSchema)

module.exports.UserCart = UserCart
