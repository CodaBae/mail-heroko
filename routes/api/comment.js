const jwt = require('jsonwebtoken')
const config = require('config')
const {auth} = require('../../middleware/auth')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const {Comment} = require('../../model/Comment')
const {Mail} = require('../../model/Mail')



router.get('/', async (req, res) => {
    const result = await Comment.find()
    res.send(result)
})

router.post('/me', auth, async (req, res) => {
    comment = new Comment(_.pick(req.body,['comment']))

    const mail = await Mail.findOne({user:req.user._id})

    if (!mail) return 'Mail with id doesnt exist'
    mail.comment.push(comment)
    await mail.save()
    res.send(mail)
})



router.delete('/me',auth, async (req, res) => {
    const result = await Comment.findByIdAndRemove({user: req.user._id})
    if (!result) return res.status(404).send('comment with id not found')
    res.send(result)
})

module.exports = router