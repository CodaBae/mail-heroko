const mongoose = require('mongoose');
const Joi = require('joi')

const SmtpSchema = new mongoose.Schema({
    smtpUrl: {
        type: String,
        required: true

    },
    smtpEmail: {
        type: String,
        required: true

    },
    smtpPassword: {
        type: String,
        required: true

    },
    date: {
        type: Date,
        default: Date.now
    },

});

const validateFun = (smtp) => {
    const schema = {
        smtpUrl: Joi.string().required(),
        smtpEmail: Joi.string().min(4).required(),
        smtpPassword: Joi.string().required(),

    }
    return Joi.validate(smtp, schema)
}

const Smtp = mongoose.model('Smtp', SmtpSchema);


module.exports.Smtp = Smtp;
module.exports.validateFun = validateFun;


