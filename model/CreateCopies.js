const mongoose = require('mongoose')

const createCopiesSchema = new mongoose.Schema({
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
const CreateCopiesSchema = mongoose.model('CreateCopiesSchema', createCopiesSchema)

module.exports.CreateCopiesSchema = CreateCopiesSchema
