const mongoose = require('mongoose')
const Joi = require('joi')

const commentSchema = new mongoose.Schema({
    comment: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const validateFun = (comment) => {
    const schema = {
        comment: Joi.string().min(3).required(),
    }
    return Joi.validate(comment, schema)
}
const Comment = mongoose.model('Comment', commentSchema)

module.exports.Comment = Comment
module.exports.validateFun = validateFun