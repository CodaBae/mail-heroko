const mongoose = require('mongoose')

const createTempletesSchema = new mongoose.Schema({
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
const CreateTempletesSchema = mongoose.model('CreateTempletesSchema', createTempletesSchema)

module.exports.CreateTempletesSchema = CreateTempletesSchema
