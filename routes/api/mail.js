const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const { Mail } = require('../../model/Mail');
const { Smtp } = require('../../model/Smtp');
const { auth } = require('../../middleware/auth')
const { User } = require('../../model/User')

// Mail
// @route   GET api/mails/test

router.get('/', auth, async (req, res) => {
    const mail = await Mail.find().populate('comment', ['comment']);
    res.send(mail)
})
router.get('/me', auth, async (req, res) => {
    const mail = await Mail.findOne({ user: req.user._id })
    if (!mail) return 'Mail with id doesnt exist'
    res.send(mail)
})

router.post('/', auth, (req, res) => {
    const { to, cc, bcc, subject, message, attachment, smtpDetails } = req.body;

    if (!to || !subject || !message || !smtpDetails) return res.status(400).send('input cannot be empty')

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'miracle8093@gmail.com',
            pass: 'iamrootdev'
        }
    });

    let mailOptions = {
        from: 'miracle8093@gmail.com',
        to: to,
        cc: cc,
        bcc: bcc,
        subject: subject,
        text: `${message}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send('mail not sent')

        } else {
            console.log('Email sent: ' + info.response);
            res.send('mail sent')
        }
    });
    console.log(to)
    console.log(message)
    console.log(Mail)
    // Smtp.findOne({ smtpEmail: smtpDetails }).then(user => {
    //     if (user) {
    //         let smtpUrl = user.smtpUrl.trim()
    //         let smtpPassword = user.smtpPassword.trim()
    //         let smtpEmail = user.smtpEmail.trim()

    //         console.log(smtpEmail, smtpUrl, smtpPassword)

            
    //         // const newMail = new Mail({
    //         //     to,
    //         //     cc,
    //         //     bcc,
    //         //     subject,
    //         //     message,
    //         //     attachment,
    //         //     smtpDetails
    //         // });
    //         // return newMail
    //         //     .save()
    //         //     .then(mail => {
    //         //         res.status(200).send('sent')
    //         //     })
    //         //     .catch(err => console.log(err));
    //     } else {
    //        res.send('add account')
    //     }
    // })
})

router.delete('/:id', async (req, res) => {
    const mail = await Mail.findByIdAndRemove(req.params.id)
    if (!mail) return res.status(404).send('user with id not found')
    res.send(mail)
})

module.exports = router;