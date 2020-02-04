const express = require('express')
const home = require('../routes/api/home')
const users = require('../routes/api/users')
const contact = require('../routes/api/contact')
const mail = require('../routes/api/mail')
const smtp = require('../routes/api/smtp')
const profile = require('../routes/api/profile')
const auth = require('../routes/api/auth')
const comment = require('../routes/api/comment')
const createCopies = require('../routes/api/createCopies')
const createTempletes = require('../routes/api/createTempletes')
const userCart = require('../routes/api/userCart')



module.exports = function (app) {
    app.use(express.json())
    app.use('/', home)
    app.use('/api/users', users)
    app.use('/api/contact', contact)
    app.use('/api/mail', mail)
    app.use('/api/smtp', smtp)
    app.use('/api/profile', profile)
    app.use('/api/auth', auth)
    app.use('/api/comment', comment)
    app.use('/api/createTempletes', createTempletes)
    app.use('/api/createCopies', createCopies)
    app.use('/api/userCart', userCart)
}
