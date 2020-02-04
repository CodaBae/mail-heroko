const mongoose = require('mongoose')
const Joi = require('joi')

const contactSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    location: String,
    des: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const validateFun = (contact) => {
    const schema = {
        fullName: Joi.string().min(3).required(),
        email: Joi.string().min(3).required(),
        phoneNumber: Joi.string().min(11).required(),
        location: Joi.string(),
        des: Joi.string()
    }
    return Joi.validate(contact, schema)
}
const Contact = mongoose.model('contact', contactSchema)

module.exports.Contact = Contact
module.exports.validateFun = validateFun