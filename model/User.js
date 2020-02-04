const mongoose = require('mongoose')
const Joi = require('joi')
var passportLocalMongoose = require("passport-local-mongoose");

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPass: String,
    avatar: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    date: {
        type: Date,
        default: Date.now
    }
})
const validateFun = (user) => {
    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required(),
        confirmPass: Joi.string().min(6).required(),
    }
    return Joi.validate(user, schema)
}
usersSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', usersSchema)

module.exports.User = User
module.exports.validateFun = validateFun