const mongoose = require('mongoose');


const MailSchema = new mongoose.Schema({
    to: {
        type: [String],
        required: true
    },
    cc: {
        type: [String],
    },
    bcc: {
        type: [String],
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
    },
    smtpDetails: {
        type: String,
        required: true
    },
    comment:{
        type:[String],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },

    date: {
        type: Date,
        default: Date.now
    },

});

const Mail = mongoose.model('Mail', MailSchema);

module.exports.Mail = Mail;



